{{-- @extends('report.dom') --}}
@php
    function toUppercase($string) {
        if(is_null($string)) return '';
        $string = str_replace(['-', '_'], ' ', $string); 
        return ucwords(strtolower($string));
    }
    
    function getCheckBox($value) {
        return (!empty($value) && $value != '0') ? '[ / ]' : '[ ]';
    }
@endphp
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>RUJUKAN EDUKASI PASIEN DENGAN HIPERTENSI</title>
    {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">
    {{-- @else
        <link rel="stylesheet" href="service/css/report/paper.css">
        <link rel="stylesheet" href="service/css/report/table.css">
        <link rel="stylesheet" href="service/css/report/tabel.css">

        <link href="service/css/style.css" rel="stylesheet">
    @endif --}}

    <style>
        @page {
            size: A4;
            margin: 5mm 5mm 6mm 5mm;
        }

        body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: Arial, sans-serif;
            font-size: 11px;
        }

        .page {
            page-break-after: always;
        }

        .block {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
        }

        .header-table td {
            border: none;
            padding: 2px;
        }

        .title-section {
            font-weight: bold;
            font-size: 11px;
            padding: 6px;
            background-color: #f0f0f0;
            border: 1px solid #000;
        }

        .checkbox-row {
            padding: 3px;
        }

        .content-row td {
            border: 1px solid #000;
            padding: 3px;
            height: 20px;
        }

        .footer2 {
            text-align: center;
            margin-top: 30px;
        }

        .text-center {
            text-align: center;
        }

        .bold {
            font-weight: bold;
        }
    </style>

</head>
<body>
    <section class="block" style="font-family:Arial;">
        <!-- HEADER -->
        <table cellspacing="0" cellpadding="0" border="0" class="header-table">
            <tr>
                <td style="text-align: center;" width="10%">
                        <img src="img/diy.png" alt="Logo" style="width: 100px; margin: 0 !important;
                        padding: 0 !important;">
                </td>
                <td style="text-align: center;vertical-align: top" width="55%">
                    <p style="margin:0; padding:0; font-size: 10px; font-weight: bold;">{{ $res['profile']->baris1 }}</p>
                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ $res['profile']->baris2 }}</p>
                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ strtoupper($res['profile']->namalengkap) }}</p>
                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;"><br>
                    <p style="font-size:8pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos }}</p>
                    <p style="font-size:8pt; margin:0;">Telp: (0274) 895143, 895297 | Faks: {{ $res['profile']->faksimile }}</p>
                </td>
                <td width="35%" style="vertical-align: middle">
                            <img src="img/logo_grhasia_full.png" alt="Logo" style="width: 180px; margin: 0 !important;
                            padding: 0 !important;">
                </td>
            </tr>
            <tr>
                    <td colspan="3">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="6">RUJUKAN EDUKASI PASIEN DENGAN HIPERTENSI</th>
            </tr>
        </table>
        <div style="padding: 10px;">
            <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px;" border="0" class="header-table">
                <tr>
                    <td width="18%"><b>Rumah Sakit</b></td>
                    <td width="2%">:</td>
                    <td width="80%">{{ strtoupper($res['profile']->namalengkap) }}</td>
                </tr>
                <tr>
                    <td><b>Puskesmas Tujuan</b></td>
                    <td>:</td>
                    <td>{{ $item[1901307000] ?? '' }}</td>
                </tr>
                <tr>
                    <td><b>Tanggal</b></td>
                    <td>:</td>
                    <td>{{ $item[1901306000] ?? '' }}</td>
                </tr>
                <tr>
                    <td><b>Nama Pasien</b></td>
                    <td>:</td>
                    <td>{{ $item[1901306001] ?? '' }}</td>
                </tr>
                <tr>
                    <td><b>Umur</b></td>
                    <td>:</td>
                    <td>{{ $item[1901306002] ?? '' }}</td>
                </tr>
                <tr>
                    <td><b>Jenis Kelamin</b></td>
                    <td>:</td>
                    <td>
                        @if ($item[1901306003])
                            Laki-laki
                        @elseif ($item[1901306004])
                            Perempuan
                        @endif
                            
                    </td>
                </tr>
                <tr>
                    <td><b>Diagnosa</b></td>
                    <td>:</td>
                    <td>{{ $item[1901306005] ?? '' }}</td>
                </tr>
                <tr>
                    <td><b>Riwayat Perawatan</b></td>
                    <td>:</td>
                    <td>{{ $item[1901306006] ?? '' }}</td>
                </tr>
            </table>
            <div style="margin-top: 12px;">
                <p style="font-size: 12px; font-weight:bold; margin:0 0 8px 0;">Rekomendasi Edukasi dan Tindak Lanjut di Puskesmas</p>
                <ol style="margin:0; padding-left:18px; font-size:11px;">
                    <li style="margin-bottom:6px;"><b>Melanjutkan pengobatan anti hipertensi</b>
                        <p style="margin:4px 0 0 0;">Pasien diberikan edukasi yang jelas, konsisten, dan berkelanjutan mengenai pentingnya konsumsi obat antihipertensi setiap hari sesuai anjuran dokter, meskipun keluhan atau gejala telah berkurang atau tidak dirasakan.</p>
                        <p style="margin:4px 0 0 0;">Ditekankan bahwa penghentian obat secara tiba-tiba dapat menyebabkan peningkatan tekanan darah dan risiko komplikasi serius.</p>
                    </li>
                    <li style="margin-bottom:6px;"><b>Melakukan pemeriksaan tekanan darah secara rutin dan mandiri</b>
                        <p style="margin:4px 0 0 0;">Pasien dianjurkan untuk:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Melakukan pemeriksaan tekanan darah secara rutin di Puskesmas sesuai jadwal kontrol</li>
                            <li style="margin-bottom:3px;">Melakukan pengukuran tekanan darah secara mandiri di rumah bila memungkinkan</li>
                            <li style="margin-bottom:3px;">Mencatat hasil pengukuran tekanan darah dalam buku kontrol untuk evaluasi pada kunjungan berikutnya</li>
                            <li style="margin-bottom:3px;">Segera melapor ke tenaga kesehatan bila tekanan darah ≥ 140/90 mmHg secara berulang atau disertai keluhan</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Penjelasan tentang pencegahan komplikasi</b>
                        <p style="margin:4px 0 0 0;">Pasien diberikan edukasi mengenai risiko komplikasi hipertensi seperti stroke, penyakit jantung, gagal ginjal, dan gangguan penglihatan, serta cara pencegahannya, meliputi:</p>
                        <ol type="a" style="margin:4px 0 0 0 18px;">
                            <li style="margin-bottom:3px;"><b>Kepatuhan Minum Obat</b>
                                <p style="margin:4px 0 0 0 18px;">Pasien diarahkan untuk:</p>
                                <ul style="margin:4px 0 0 0 36px; padding-left:0; list-style-type:none;">
                                    <li style="margin-bottom:3px;">Sesuaikan waktu minum obat dengan rutinitas harian (misal: bersamaan dengan minum obat jiwa di pagi/malam hari).</li>
                                    <li style="margin-bottom:3px;">Meminum obat pada waktu yang sama setiap hari</li>
                                    <li style="margin-bottom:3px;">Tidak melewatkan dosis obat</li>
                                    <li style="margin:3px 0;">Jika lupa minum obat, segera minum begitu teringat. Jangan menggandakan dosis jika sudah mendekati waktu dosis berikutnya.</li>
                                    <li style="margin-bottom:3px;">Menggunakan pengingat (alarm HP atau kotak obat) bila diperlukan</li>
                                </ul>
                            </li>
                            <li style="margin-bottom:3px;"><b>Pengawasan Dosis Pemberian Obat</b>
                                <p style="margin:4px 0 0 0 18px;">Pasien dan keluarga diberikan pemahaman untuk:</p>
                                <ul style="margin:4px 0 0 0 36px; padding-left:0; list-style-type:none;">
                                    <li style="margin-bottom:3px;">Tidak mengubah dosis, jenis, atau menghentikan obat tanpa evaluasi dokter.</li>
                                    <li style="margin-bottom:3px;">Melaporkan efek samping obat yang dirasakan kepada tenaga kesehatan</li>
                                    <li style="margin-bottom:3px;">Membawa daftar obat yang dikonsumsi saat kontrol kesehatan</li>
                                </ul>
                            </li>
                        </ol>
                    </li>
                    <li style="margin-bottom:6px;"><b>Dukungan Psikososial</b>
                        <p style="margin:4px 0 0 0;">Pasien dan keluarga diberikan dukungan psikososial berupa:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Edukasi bahwa hipertensi merupakan penyakit kronis yang dapat dikendalikan</li>
                            <li style="margin-bottom:3px;">Dukungan keluarga dalam pengawasan minum obat dan pola hidup sehat</li>
                            <li style="margin-bottom:3px;">Anjuran mengelola stres melalui aktivitas relaksasi, ibadah, olahraga ringan, dan istirahat cukup</li>
                            <li style="margin-bottom:3px;">Rujukan ke konseling bila ditemukan kecemasan, depresi, atau kesulitan kepatuhan pengobatan</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Jadwal Pengawasan dan Pemantauan</b>
                        <p style="margin:4px 0 0 0;">Pasien dianjurkan untuk:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Kontrol rutin ke Puskesmas sesuai jadwal yang ditetapkan</li>
                            <li style="margin-bottom:3px;">Evaluasi tekanan darah, kepatuhan obat, dan efek samping secara berkala</li>
                            <li style="margin-bottom:3px;">Penyesuaian terapi dilakukan berdasarkan hasil pemantauan tekanan darah dan kondisi klinis pasien</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Konseling Nutrisi untuk Mendukung Pengobatan</b>
                        <p style="margin:4px 0 0 0;">Pasien diberikan konseling nutrisi meliputi:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Pembatasan konsumsi garam (&lt; 5 gram/hari)</li>
                            <li style="margin-bottom:3px;">Penerapan pola makan seimbang (DASH diet)</li>
                            <li style="margin-bottom:3px;">Peningkatan konsumsi buah dan sayur</li>
                            <li style="margin-bottom:3px;">Pembatasan makanan berlemak, gorengan, dan makanan olahan</li>
                            <li style="margin-bottom:3px;">Anjuran menjaga berat badan ideal</li>
                            <li style="margin-bottom:3px;">Edukasi membaca label makanan rendah garam</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Rujukan Kembali Jika Terjadi Komplikasi</b>
                        <p style="margin:4px 0 0 0;">Pasien direncanakan untuk dirujuk kembali ke fasilitas kesehatan rujukan apabila terjadi:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Peningkatan tekanan darah tidak terkontrol</li>
                            <li style="margin-bottom:3px;">Gejala neurologis seperti kelemahan mendadak, bicara pelo, atau penurunan kesadaran</li>
                            <li style="margin-bottom:3px;">Nyeri dada, sesak napas, atau penurunan fungsi ginjal</li>
                        </ul>
                    </li>
                </ol>
            </div>
            <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px;" border="0" class="header-table">
                <tr>
                    <td width="70%"></td>
                    <td width="30%" style="text-align: center">
                        Yogyakarta,{{ $item[1901307160] ?? '' }}<br>
                        Dokter Yang Merujuk
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="height: 60px;"></td>
                </tr>
                <tr>
                    <td width="70%"></td>
                    <td width="30%" style="text-align: center">
                        Dokter Yang Merujuk <br>
                        {{ trim(preg_replace('/[0-9~]+/', '', $item[1901307170] ?? '')) }}
                    </td>
                </tr>
            </table>
        </div>
    </section>
</body>
</html>

