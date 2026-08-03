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
            margin: 10mm 15mm 10mm 15mm;
        }

        body, table, td, th, div, span, p, li {
            font-family: Tahoma, Geneva, sans-serif;
            font-size: 10.5pt;
            line-height: 1.4;
            color: #000;
        }

        body {
            margin: 0 !important;
            padding: 0 !important;
            text-align: justify;
        }

        .content-section, .content-section h2, .content-section div, .content-section p, .content-section li {
            font-family: Tahoma, Geneva, sans-serif !important;
            font-size: 10.5pt !important;
            text-align: justify;
        }

        .no-break {
            display: block !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        ul.arrow-list {
            list-style-type: none;
            padding-left: 0;
            margin: 4px 0 0 20px;
        }

        ul.arrow-list > li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 3px;
        }

        ul.arrow-list > li::before {
            content: "➢";
            font-family: "DejaVu Sans", sans-serif !important;
            font-size: 10pt !important;
            position: absolute;
            left: 0;
            top: 2px;
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
    <section style="padding: 0; page-break-after: page;">
        <!-- HEADER -->
        <table cellspacing="0" cellpadding="0" border="0" class="header-table" style="width: 100%; border-bottom: 2px solid #000; margin-bottom: 6px; padding-bottom: 5px;">
            <tr>
                <td style="text-align: left; vertical-align: middle; border: none;" width="12%">
                    <img src="img/diy.png" alt="Logo DIY" style="width: 75px; height: auto; margin: 0; padding: 0;">
                </td>
                <td style="text-align: center; vertical-align: middle; padding: 0 5px; border: none;" width="73%">
                    <span style="font-size: 12pt; font-weight: bold; color: #000;">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</span><br>
                    <span style="font-size: 12pt; font-weight: bold; color: #000;">DINAS KESEHATAN</span><br>
                    <span style="font-size: 12pt; font-weight: bold; color: #000;">RUMAH SAKIT JIWA GRHASIA</span><br>
                    <img src="img/aksara_jawa-com.png" alt="Aksara Jawa" style="width: 140px; height: auto; margin-top: 1px; margin-bottom: 1px;"><br>
                    <span style="font-size: 8pt; font-weight: normal; line-height: 1.2; color: #000;">
                        Jalan Kaliurang Km 17 Sleman 55582, Telepon: (0274) 895143/895297, Faksimile: (0274) 895142<br>
                        Pos-el: grhasiamentalhospital@jogjaprov.go.id&nbsp;&nbsp;Laman: grhasia.jogjaprov.go.id
                    </span>
                </td>
                <td style="text-align: right; vertical-align: middle; border: none;" width="15%">
                    <img src="img/logo_grhasia_full.png" alt="Logo Grhasia" style="width: 120px; height: auto; margin: 0; padding: 0;">
                </td>
            </tr>
        </table>
        <table cellspacing="0" cellpadding="0" border="0" class="header-table" style="width: 100%;">
            <tr>
                <th style="font-size: 12pt; font-weight: bold; padding-bottom: 12px; padding-top: 12px; border: none; text-align: center;" colspan="6">RUJUKAN EDUKASI PASIEN DENGAN HIPERTENSI</th>
            </tr>
        </table>
        <div style="padding: 10px;">
            <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px;" border="0" class="header-table">
                <tr>
                    <td width="26%">Rumah Sakit</td>
                    <td width="2%">:</td>
                    <td width="72%">{{ strtoupper($res['profile']->namalengkap) }}</td>
                </tr>
                <tr>
                    <td>Puskesmas Tujuan</td>
                    <td>:</td>
                    <td>{{ $item[1901307000] ?? '' }}</td>
                </tr>
                <tr>
                    <td>Tanggal Masuk</td>
                    <td>:</td>
                    <td>{{ $item[1901306000] ?? '' }}</td>
                </tr>
                <tr>
                    <td>Nama Pasien</td>
                    <td>:</td>
                    <td>{{ $item[1901306001] ?? '' }}</td>
                </tr>
                <tr>
                    <td>Umur</td>
                    <td>:</td>
                    <td>{{ $item[1901306002] ?? '' }}</td>
                </tr>
                <tr>
                    <td>Jenis Kelamin</td>
                    <td>:</td>
                    <td>
                        @if (!empty($item[1901306003]))
                            Laki-laki
                        @endif

                        @if (!empty($item[1901306004]))
                            Perempuan
                        @endif
                    </td>
                </tr>
                <tr>
                    <td>Diagnosa</td>
                    <td>:</td>
                    <td>{{ $item[1901306005] ?? '' }}</td>
                </tr>
                <tr>
                    <td>Pengobatan Terakhir</td>
                    <td>:</td>
                    <td>{{ $item[1901306006] ?? '' }}</td>
                </tr>
            </table>            
            <div style="margin-top: 12px;">
                <p style="font-size: 11pt; font-weight:bold; margin:0 0 8px 0;">Rekomendasi Edukasi dan Tindak Lanjut di Puskesmas</p>
                <div style="padding-left: 20px; margin-top: 10px;">
                    <div class="no-break" style="margin-bottom: 15px;">
                        <div style="font-weight: bold; margin-bottom: 5px;">1. Melanjutkan pengobatan anti hipertensi</div>
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

