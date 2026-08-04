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
    <title>RUJUKAN EDUKASI PASIEN DENGAN DIABETES</title>
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
                <th style="font-size: 12pt; font-weight: bold; padding-bottom: 12px; padding-top: 12px; border: none; text-align: center;" colspan="6">RUJUKAN EDUKASI PASIEN DENGAN DIABETES</th>
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
                    <td>{{ !empty($data[0]->tglregistrasi) ? date('Y-m-d', strtotime($data[0]->tglregistrasi)) : ($item[1901306000] ?? '') }}</td>
                </tr>
                <tr>
                    <td>Nama Pasien</td>
                    <td>:</td>
                    <td>{{ !empty($data[0]->namapasien) ? $data[0]->namapasien : ($item[1901307210] ?? ($item[1901306001] ?? '')) }}</td>
                </tr>
                <tr>
                    <td>Umur</td>
                    <td>:</td>
                    <td>{{ !empty($data[0]->umur) ? $data[0]->umur : ($item[1901307230] ?? ($item[1901306002] ?? '')) }}</td>
                </tr>
                <tr>
                    <td>Jenis Kelamin</td>
                    <td>:</td>
                    <td>
                        @if (!empty($data[0]->jeniskelamin))
                            {{ $data[0]->jeniskelamin }}
                        @else
                            @if (!empty($item[1901307240]) || !empty($item[1901306003]))
                                Laki-laki
                            @elseif (!empty($item[1901307250]) || !empty($item[1901306004]))
                                Perempuan
                            @endif
                        @endif
                    </td>
                </tr>
                <tr>
                    <td>Diagnosa</td>
                    <td>:</td>
                    <td>{{ $item[1901307260] ?? ($item[1901306005] ?? '') }}</td>
                </tr>
                <tr>
                    <td style="vertical-align: top;">Pengobatan Terakhir</td>
                    <td style="vertical-align: top;">:</td>
                    <td style="white-space: pre-line;">{!! nl2br(e(preg_replace('/(?<=\S)\s+(?=\d+\.)/', "\n", $item[1901307270] ?? ''))) !!}</td>
                </tr>
            </table>
            <div style="margin-top: 12px;">
                <p style="font-size: 12px; font-weight:bold; margin:0 0 8px 0;">Rekomendasi Edukasi dan Tindak Lanjut di Puskesmas</p>
                <ol style="margin:0; padding-left:18px; font-size:11px;">
                    <li style="margin-bottom:6px;"><b>Melanjutkan pengobatan anti Diabetes</b>
                        <p style="margin:4px 0 0 0;">Pasien diberikan edukasi secara jelas dan berkelanjutan mengenai:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Pentingnya kepatuhan terhadap pengobatan DM sesuai anjuran dokter, baik obat oral maupun insulin bila digunakan.</li>
                            <li style="margin-bottom:3px;">Ditekankan bahwa obat harus dikonsumsi secara teratur dan berkesinambungan, meskipun kadar gula darah atau keluhan sudah membaik.</li>
                            <li style="margin-bottom:3px;">Tidak menghentikan pengobatan tanpa konsultasi dengan dokter.</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Melakukan pemeriksaan gula darah secara rutin dan mandiri</b>
                        <p style="margin:4px 0 0 0;">Pasien dianjurkan untuk:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Melakukan pemeriksaan gula darah dan tekanan darah secara rutin di Puskesmas sesuai jadwal kontrol</li>
                            <li style="margin-bottom:3px;">Melakukan pemantauan mandiri gula darah di rumah bila memungkinkan</li>
                            <li style="margin-bottom:3px;">Mencatat hasil pemeriksaan dalam buku kontrol untuk evaluasi berkala</li>
                            <li style="margin-bottom:3px;">Segera melapor ke tenaga kesehatan bila gula darah melebihi atau di bawah nilai normal dan disertai keluhan</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Penjelasan tentang pencegahan komplikasi</b>
                        <p style="margin:4px 0 0 0;">Pasien diberikan edukasi mengenai risiko komplikasi DM seperti penyakit jantung, stroke, gagal ginjal, neuropati, retinopati, dan luka kaki diabetik, serta upaya pencegahannya, meliputi:</p>
                        <ol type="a" style="margin:4px 0 0 0 18px;">
                            <li style="margin-bottom:3px;"><b>Kepatuhan Minum Obat</b>
                                <p style="margin:4px 0 0 0 18px;">Pasien diarahkan untuk:</p>
                                <ul style="margin:4px 0 0 0 36px; padding-left:0; list-style-type:none;">
                                    <li style="margin-bottom:3px;">Mengonsumsi obat pada waktu yang sama setiap hari</li>
                                    <li style="margin-bottom:3px;">Tidak melewatkan dosis</li>
                                    <li style="margin-bottom:3px;">Jika lupa minum obat, segera minum begitu teringat. Jangan menggandakan dosis jika sudah mendekati waktu dosis berikutnya.</li>
                                    <li style="margin-bottom:3px;">Menggunakan pengingat bila diperlukan</li>
                                    <li style="margin-bottom:3px;">Memahami cara penggunaan obat, termasuk insulin bila digunakan</li>
                                </ul>
                            </li>
                            <li style="margin-bottom:3px;"><b>Pengawasan Dosis Pemberian Obat</b>
                                <p style="margin:4px 0 0 0 18px;">Pasien dan keluarga diberikan edukasi untuk:</p>
                                <ul style="margin:4px 0 0 0 36px; padding-left:0; list-style-type:none;">
                                    <li style="margin-bottom:3px;">Tidak mengubah dosis atau jenis obat tanpa evaluasi dokter</li>
                                    <li style="margin-bottom:3px;">Melaporkan efek samping atau keluhan terkait obat</li>
                                    <li style="margin-bottom:3px;">Membawa daftar obat saat kontrol rutin</li>
                                    <li style="margin-bottom:3px;">Edukasi ke pasien bila muncul tanda hipoglikemi seperti keringat dingin, lemas, gemetar, pusing; segera minum manis dan memeriksakan diri ke pusat kesehatan terdekat.</li>
                                </ul>
                            </li>
                        </ol>
                    </li>
                    <li style="margin-bottom:6px;"><b>Dukungan Psikososial</b>
                        <p style="margin:4px 0 0 0;">Pasien dan keluarga diberikan dukungan psikososial berupa:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Edukasi bahwa DM merupakan penyakit kronis yang dapat dikendalikan</li>
                            <li style="margin-bottom:3px;">Dukungan keluarga dalam kepatuhan minum obat, pemantauan gula darah, dan pola hidup sehat</li>
                            <li style="margin-bottom:3px;">Edukasi manajemen stres dan anjuran aktivitas fisik sesuai kemampuan</li>
                            <li style="margin-bottom:3px;">Rujukan ke konseling bila ditemukan masalah psikologis atau penurunan kepatuhan terapi</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Jadwal Pengawasan dan Pemantauan</b>
                        <p style="margin:4px 0 0 0;">Pasien dianjurkan untuk:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Kontrol rutin ke Puskesmas sesuai jadwal yang ditentukan</li>
                            <li style="margin-bottom:3px;">Evaluasi kadar gula darah, tekanan darah, berat badan, dan kepatuhan terapi secara berkala</li>
                            <li style="margin-bottom:3px;">Pemeriksaan penunjang sesuai indikasi (HbA1c, fungsi ginjal, lipid)</li>
                            <li style="margin-bottom:3px;">Penyesuaian terapi dilakukan berdasarkan hasil pemantauan klinis</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Konseling Nutrisi untuk Mendukung Pengobatan</b>
                        <p style="margin:4px 0 0 0;">Pasien diberikan konseling nutrisi meliputi:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Pengaturan pola makan seimbang sesuai kebutuhan kalori</li>
                            <li style="margin-bottom:3px;">Pembatasan konsumsi gula sederhana dan makanan tinggi indeks glikemik</li>
                            <li style="margin-bottom:3px;">Peningkatan konsumsi serat (sayur dan buah)</li>
                            <li style="margin-bottom:3px;">Pembagian porsi makan teratur (3 kali makan utama dan 2–3 selingan)</li>
                            <li style="margin-bottom:3px;">Edukasi label makanan dan pengaturan berat badan ideal</li>
                        </ul>
                    </li>
                    <li style="margin-bottom:6px;"><b>Rujukan Kembali Jika Terjadi Komplikasi</b>
                        <p style="margin:4px 0 0 0;">Pasien direncanakan untuk dirujuk kembali ke fasilitas kesehatan rujukan apabila ditemukan:</p>
                        <ul style="margin:4px 0 0 0 18px; padding-left:0; list-style-type:none;">
                            <li style="margin-bottom:3px;">Kadar gula darah tidak terkendali meskipun terapi optimal</li>
                            <li style="margin-bottom:3px;">Hipoglikemia atau hiperglikemia berulang</li>
                            <li style="margin-bottom:3px;">Luka diabetik, gangguan penglihatan, gangguan neurologis (neuropati diabetikum) atau penurunan fungsi ginjal</li>
                            <li style="margin-bottom:3px;">Tanda komplikasi akut atau kronis lainnya</li>
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

