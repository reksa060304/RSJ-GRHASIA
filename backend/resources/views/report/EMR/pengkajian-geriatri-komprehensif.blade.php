<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="css/report/paper.css">
    <link rel="stylesheet" href="css/report/table.css">
    <link rel="stylesheet" href="css/report/tabel.css">
    <link href="css/style.css" rel="stylesheet">
    <title>PENGKAJIAN GERIATRI KOMPREHENSIF</title>
    <style>
        @page {
            size: A4;
            margin: 5mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 8.5pt;
            line-height: 1.15;
            color: #000;
        }

        .page-container {
            width: 100%;
            page-break-after: always;
            box-sizing: border-box;
            padding: 5px;
        }

        .page-container:last-child {
            page-break-after: avoid;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2px;
        }

        .header-table td {
            border: none;
            padding: 0px;
        }

        .double-border {
            border-bottom: 3px double #000;
            margin-bottom: 8px;
        }

        .patient-box {
            border: 1px solid #000;
            padding: 4px;
            font-size: 8pt;
        }

        .patient-box table {
            width: 100%;
            border-collapse: collapse;
        }

        .patient-box td {
            border: none;
            padding: 1px 2px;
        }

        .title-text {
            font-size: 11pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 8px;
        }

        .section-title {
            background-color: #dbdbdb;
            font-weight: bold;
            padding: 3px 6px;
            border: 1px solid #000;
            margin-top: 6px;
            margin-bottom: 4px;
            font-size: 9pt;
        }

        .content-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
        }

        .content-table th, .content-table td {
            border: 1px solid #000;
            padding: 3px 5px;
            font-size: 8pt;
            vertical-align: top;
        }

        .content-table th {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
        }

        .cb-container {
            width: 100%;
            margin-bottom: 2px;
            clear: both;
        }
        .cb-cell-box {
            display: inline-block;
            vertical-align: top;
            width: 14px;
        }
        .cb-cell-text {
            display: inline-block;
            vertical-align: top;
            width: 85%;
            line-height: 1.15;
        }

        .check-box {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 1px solid #000;
            text-align: center;
            line-height: 14px;
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 15px;
            font-weight: bold;
            margin-right: 3px;
            background-color: #fff;
        }

        .text-bold {
            font-weight: bold;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .mt-5 {
            margin-top: 5px;
        }

        .mb-5 {
            margin-bottom: 5px;
        }

        .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        .signature-table td {
            border: none;
            text-align: center;
            vertical-align: top;
            padding: 5px;
            font-size: 8.5pt;
        }

        .nested-table {
            width: 100%;
            border-collapse: collapse;
        }
        .nested-table td {
            border: none;
            padding: 1px;
        }
    </style>
</head>
<body class="A4">
<?php
    $checkmark = '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj48cGF0aCBkPSJNMiw1IEw0LDcgTDgsMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiAvPjwvc3ZnPg==" width="10" height="10" style="display: inline-block; vertical-align: middle; margin-top: -2px;">';

    $patient = (object)[
        'nocm'        => '',
        'namapasien'  => '',
        'tgllahir'    => '1900-01-01',
        'jeniskelamin'=> '',
        'umur'        => '',
        'namadokter'  => '',
        'namaruangan' => '',
        'noemr'       => '',
        'noregistrasi'=> '',
        'alamatlengkap'=> '',
    ];
    if (!empty($res['d']) && isset($res['d'][0])) {
        $d0 = $res['d'][0];
        $patient->nocm         = $d0->nocm         ?? '';
        $patient->namapasien   = $d0->namapasien   ?? '';
        $patient->tgllahir     = $d0->tgllahir     ?? '1900-01-01';
        $patient->jeniskelamin = $d0->jeniskelamin ?? '';
        $patient->umur         = $d0->umur         ?? '';
        $patient->namadokter   = $d0->namadokter   ?? '';
        $patient->namaruangan  = $d0->namaruangan  ?? '';
        $patient->noemr        = $d0->noemr        ?? '';
        $patient->noregistrasi = $d0->noregistrasi ?? '';
        $patient->alamatlengkap= $d0->alamatlengkap ?? '';
    }
?>

    <!-- ==================== PAGE 1 ==================== -->
    <div class="page-container">
        <!-- Standard Header -->
        <table class="header-table">
            <tr>
                <td style="text-align: center;" width="15%">
                    <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin: 0 !important; padding: 0 !important;">
                    <br>
                    <span style="font-size: 7.5pt; font-weight: bold">RS JIWA GRHASIA</span>
                    <br>
                    <span style="font-size: 8.5px; font-weight: bold">Daerah Istimewa Yogyakarta</span>
                </td>
                <td style="text-align: center; vertical-align: top;" width="55%">
                    <b>
                        <span style="font-size: 9.5pt;">{!! $res['profile']->baris1 !!}</span>
                        <br>
                        <span style="font-size: 10.5pt;">{!! $res['profile']->baris2 !!}</span>
                        <br>
                        <span style="font-size: 10.5pt;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                        <br>
                        <img src="img/aksara_jawa-com.png" alt="Aksara" style="width: 160px; margin-top: 2px; margin-bottom: 2px;">
                        <br>
                        <span style="font-size: 8pt; font-weight: normal;">
                            Jalan Kaliurang Km 17 Sleman, Telepon: {!! $res['profile']->fixedphone !!}
                            <br style="margin: 0px">
                            Laman: {!! $res['profile']->website !!}, Surel: {!! $res['profile']->alamatemail !!}
                        </span>
                    </b>
                </td>
                <td width="30%" style="vertical-align: top;">
                    <div class="patient-box" style="font-size: 7.5pt; line-height: 1.25; padding: 4px;">
                        <table style="width: 100%; border-collapse: collapse; border: none;">
                            <tr style="border: none;">
                                <td style="width: 85px; border: none; padding: 1px 0; vertical-align: top;">Nomor RM</td>
                                <td style="width: 8px; border: none; padding: 1px 0; vertical-align: top;">:</td>
                                <td style="border: none; padding: 1px 0; vertical-align: top;">{!! $patient->nocm !!}</td>
                            </tr>
                            <tr style="border: none;">
                                <td style="border: none; padding: 1px 0; vertical-align: top;">Nama Pasien</td>
                                <td style="border: none; padding: 1px 0; vertical-align: top;">:</td>
                                <td style="border: none; padding: 1px 0; vertical-align: top;">{!! $patient->namapasien !!}</td>
                            </tr>
                            <tr style="border: none;">
                                <td style="border: none; padding: 1px 0; vertical-align: top;">Tanggal lahir</td>
                                <td style="border: none; padding: 1px 0; vertical-align: top;">:</td>
                                <td style="border: none; padding: 1px 0; vertical-align: top;">{!! ($patient->tgllahir && $patient->tgllahir !== '1900-01-01') ? date('d-m-Y', strtotime($patient->tgllahir)) : '-' !!}</td>
                            </tr>
                            <tr style="border: none;">
                                <td style="border: none; padding: 1px 0; vertical-align: top;">Jenis Kelamin</td>
                                <td style="border: none; padding: 1px 0; vertical-align: top;">:</td>
                                <td style="border: none; padding: 1px 0; vertical-align: top;">{!! $patient->jeniskelamin !!}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 4px;">
                            <i style="font-size: 6.5pt;">(Mohon diisi huruf kapital atau tempelkan stiker jika ada)</i>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <div style="border-top: 2px solid #000; margin-top: 5px;"></div>
        <div class="title-text" style="padding-top: 10px; font-weight: bold; text-align: center; font-size: 11pt;">PENGKAJIAN GERIATRI KOMPREHENSIF</div>

        <!-- Section I -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 15px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">I.</td>
                <td>Keluhan Utama</td>
            </tr>
        </table>
        <div style="padding-left: 55px; min-height: 40px; font-size: 8.5pt;">
            {!! isset($item[310000]) ? nl2br(e($item[310000])) : '' !!}
        </div>

        <!-- Section II -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">II.</td>
                <td>Riwayat Penyakit Sekarang</td>
            </tr>
        </table>
        <div style="padding-left: 55px; min-height: 40px; font-size: 8.5pt;">
            {!! isset($item[310001]) ? nl2br(e($item[310001])) : '' !!}
        </div>

        <!-- Section III -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">III.</td>
                <td>Riwayat Penyakit Dahulu</td>
            </tr>
        </table>
        <table style="width: 100%; border: none; padding-left: 55px; font-size: 8.5pt; line-height: 1.4;">
            <tr>
                <td style="width: 25px;">1.</td>
                <td style="width: 200px;">Riwayat penyakit sebelumnya</td>
                <td>: {!! isset($item[310003]) ? nl2br(e($item[310003])) : '' !!}</td>
            </tr>
            <tr>
                <td>2.</td>
                <td>Riwayat rawat inap</td>
                <td>
                    : <span class="check-box">{!! !empty($item[310004]) && $item[310004] == 'Ya' ? $checkmark : '&nbsp;' !!}</span> Ya
                    <span style="margin-left: 60px;"><span class="check-box">{!! !empty($item[310004]) && $item[310004] == 'Tidak' ? $checkmark : '&nbsp;' !!}</span> Tidak</span>
                </td>
            </tr>
            <tr>
                <td>3.</td>
                <td>Riwayat operasi</td>
                <td>
                    : <span class="check-box">{!! !empty($item[310005]) && $item[310005] == 'Ya' ? $checkmark : '&nbsp;' !!}</span> Ya
                    <span style="margin-left: 60px;"><span class="check-box">{!! !empty($item[310005]) && $item[310005] == 'Tidak' ? $checkmark : '&nbsp;' !!}</span> Tidak</span>
                </td>
            </tr>
            <tr>
                <td>4.</td>
                <td colspan="2">Riwayat pengobatan <span style="margin-left: 62px;">:</span></td>
            </tr>
        </table>
        <table style="width: 100%; border: none; padding-left: 75px; font-size: 8.5pt; margin-bottom: 5px; line-height: 1.4;">
            <tr>
                <td style="width: 50%;">- Obat yang rutin dikonsumsi :<br>{!! isset($item[310007]) ? nl2br(e($item[310007])) : '' !!}</td>
                <td style="width: 50%;">- Obat yang digunakan sekarang :<br>{!! isset($item[310008]) ? nl2br(e($item[310008])) : '' !!}</td>
            </tr>
        </table>
        <table style="width: 100%; border: none; padding-left: 55px; font-size: 8.5pt; line-height: 1.4;">
            <tr>
                <td style="width: 25px;">5.</td>
                <td style="width: 200px;">Riwayat penggunaan NAPZA</td>
                <td>
                    : <span class="check-box">{!! !empty($item[310009]) && $item[310009] == 'Ya' ? $checkmark : '&nbsp;' !!}</span> Ya
                    <span style="margin-left: 60px;"><span class="check-box">{!! !empty($item[310009]) && $item[310009] == 'Tidak' ? $checkmark : '&nbsp;' !!}</span> Tidak</span>
                </td>
            </tr>
            <tr>
                <td>6.</td>
                <td>Riwayat alergi</td>
                <td>
                    : <span class="check-box">{!! !empty($item[310010]) && $item[310010] == 'Ya' ? $checkmark : '&nbsp;' !!}</span> Ya
                    <span style="margin-left: 60px;"><span class="check-box">{!! !empty($item[310010]) && $item[310010] == 'Tidak' ? $checkmark : '&nbsp;' !!}</span> Tidak</span>
                </td>
            </tr>
        </table>

        <!-- Section IV -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">IV.</td>
                <td>Riwayat Penyakit Keluarga</td>
            </tr>
        </table>
        <div style="padding-left: 55px; min-height: 40px; font-size: 8.5pt;">
            {!! isset($item[310011]) ? nl2br(e($item[310011])) : '' !!}
        </div>

        <!-- Section V -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">V.</td>
                <td>Kebiasaan</td>
            </tr>
        </table>
        <table style="width: 100%; border: none; padding-left: 55px; font-size: 8.5pt; line-height: 1.4;">
            <tr>
                <td style="width: 33%;">
                    <span class="check-box">{!! !empty($item[310013]) ? $checkmark : '&nbsp;' !!}</span> Minum Kopi
                </td>
                <td style="width: 33%;">
                    <span class="check-box">{!! !empty($item[310014]) ? $checkmark : '&nbsp;' !!}</span> Obat tidur
                </td>
                <td style="width: 34%;">
                    <span class="check-box">{!! !empty($item[310015]) ? $checkmark : '&nbsp;' !!}</span> Lain - lain
                </td>
            </tr>
            <tr>
                <td>
                    <span class="check-box">{!! !empty($item[310016]) ? $checkmark : '&nbsp;' !!}</span> Merokok
                </td>
                <td colspan="2">
                    <span class="check-box">{!! !empty($item[310017]) ? $checkmark : '&nbsp;' !!}</span> Alkohol
                </td>
            </tr>
        </table>

        <!-- Section VI -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">VI.</td>
                <td>Riwayat Psikososial</td>
            </tr>
        </table>
        <div style="padding-left: 55px; min-height: 40px; font-size: 8.5pt;">
            {!! isset($item[310018]) ? nl2br(e($item[310018])) : '' !!}
        </div>

        <!-- Section VII -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">VII.</td>
                <td>Riwayat Pribadi Pola Asuh</td>
            </tr>
        </table>
        <table style="width: 100%; border: none; padding-left: 55px; font-size: 8.5pt; line-height: 1.4;">
            <tr>
                <td style="width: 180px;">- Kepribadian sebelum sakit</td>
                <td>: {!! isset($item[310020]) ? $item[310020] : '' !!}</td>
            </tr>
            <tr>
                <td>- Pendidikan</td>
                <td>: {!! isset($item[310021]) ? $item[310021] : '' !!}</td>
            </tr>
            <tr>
                <td>- Pekerjaan</td>
                <td>: {!! isset($item[310022]) ? $item[310022] : '' !!}</td>
            </tr>
            <tr>
                <td>- Perkawinan</td>
                <td>: {!! isset($item[310023]) ? $item[310023] : '' !!}</td>
            </tr>
        </table>

        <!-- Section VIII -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">VIII.</td>
                <td>Keadaan Umum ( diisi perawat )</td>
            </tr>
        </table>
        <table style="width: 100%; border: none; padding-left: 55px; font-size: 8.5pt; line-height: 1.4; margin-bottom: 20px;">
            <tr>
                <td style="width: 25px;">1.</td>
                <td style="width: 120px;">Kesadaran</td>
                <td style="width: 15px;">:</td>
                <td>{!! isset($item[310025]) ? trim(preg_replace('/^1\.\s*Kesadaran\s*:/i', '', $item[310025])) : '' !!}</td>
            </tr>
            <tr>
                <td>2.</td>
                <td>Tekanan darah</td>
                <td>:</td>
                <td>{!! isset($item[310026]) ? trim(preg_replace('/^2\.\s*Tekanan darah\s*:/i', '', $item[310026])) : '' !!} mmHg</td>
            </tr>
            <tr>
                <td>3.</td>
                <td>Nadi</td>
                <td>:</td>
                <td>{!! isset($item[310027]) ? trim(preg_replace('/^3\.\s*Nadi\s*:/i', '', $item[310027])) : '' !!} kali/menit</td>
            </tr>
            <tr>
                <td>4.</td>
                <td>Pernapasan</td>
                <td>:</td>
                <td>{!! isset($item[310028]) ? trim(preg_replace('/^4\.\s*Pernapasan\s*:/i', '', $item[310028])) : '' !!} kali/menit</td>
            </tr>
            <tr>
                <td>5.</td>
                <td>Suhu</td>
                <td>:</td>
                <td>{!! isset($item[310029]) ? trim(preg_replace('/^5\.\s*Suhu\s*:/i', '', $item[310029])) : '' !!} &deg;C</td>
            </tr>
            <tr>
                <td>6.</td>
                <td>Tinggi badan</td>
                <td>:</td>
                <td>{!! isset($item[310030]) ? trim(preg_replace('/^6\.\s*Tinggi badan\s*:/i', '', $item[310030])) : '' !!} cm</td>
            </tr>
            <tr>
                <td>7.</td>
                <td>Berat badan</td>
                <td>:</td>
                <td>{!! isset($item[310031]) ? trim(preg_replace('/^7\.\s*Berat badan\s*:/i', '', $item[310031])) : '' !!} kg</td>
            </tr>
            <tr>
                <td>8.</td>
                <td>BMI</td>
                <td>:</td>
                <td>{!! isset($item[310032]) ? trim(preg_replace('/^8\.\s*BMI\s*:/i', '', $item[310032])) : '' !!} kg/m&sup2;</td>
            </tr>
        </table>
        <!-- Section IX -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">IX.</td>
                <td>Status Fungsional ( diisi perawat )</td>
            </tr>
        </table>
        <div style="padding-left: 55px; margin-bottom: 4px; font-size: 8.5pt;">a. Penilaian <i>Activity of Daily Living</i> (ADL) dengan Instrumen Indeks Barthel Modifikasi</div>
        <table class="content-table" style="width: 100%; table-layout: fixed; margin-bottom: 8px;">
            <thead>
                <tr>
                    <th style="width: 4%;">No</th>
                    <th style="width: 25%;">Fungsi</th>
                    <th style="width: 7%;">Skor</th>
                    <th style="width: 57%;">Keterangan</th>
                    <th style="width: 7%;">Hasil</th>
                </tr>
            </thead>
            <tbody>
                <!-- 1. BAB -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">1</td>
                    <td style="vertical-align: top;">Mengendalikan rangsang BAB</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1<br>2</td>
                    <td style="vertical-align: top;">
                        Tidak terkendali/tak teratur (perlu pencahar)<br>
                        Kadang-kadang tak terkendali (1 kali / minggu)<br>
                        Terkendali teratur
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310035]) ? '0' : (!empty($item[310036]) ? '1' : (!empty($item[310037]) ? '2' : '')) !!}
                    </td>
                </tr>
                <!-- 2. BAK -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">2</td>
                    <td style="vertical-align: top;">Mengendalikan rangsang BAK</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1<br>2</td>
                    <td style="vertical-align: top;">
                        Tak terkendali atau pakai kateter<br>
                        Kadang-kadang tak terkendali (hanya 1 kali / 24 jam)<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310038]) ? '0' : (!empty($item[310039]) ? '1' : (!empty($item[310040]) ? '2' : '')) !!}
                    </td>
                </tr>
                <!-- 3. Membersihkan diri -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">3</td>
                    <td style="vertical-align: top;">Membersihkan diri (mencuci wajah, menyikat rambut, mencukur kumis, sikat gigi)</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1</td>
                    <td style="vertical-align: top;">
                        Butuh pertolongan orang lain<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310041]) ? '0' : (!empty($item[310042]) ? '1' : ' ') !!}
                    </td>
                </tr>
                <!-- 4. Penggunaan WC -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">4</td>
                    <td style="vertical-align: top;">Penggunaan WC (keluar masuk WC, melepas/ memakai celana, cebok, menyiram)</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1<br>2</td>
                    <td style="vertical-align: top;">
                        Tergantung pertolongan orang lain<br>
                        Perlu pertolongan pada beberapa kegiatan tetapi dapat mengerjakan sendiri beberapa kegiatan yang lain<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310043]) ? '0' : (!empty($item[310044]) ? '1' : (!empty($item[310045]) ? '2' : '')) !!}
                    </td>
                </tr>
                <!-- 5. Makan minum -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">5</td>
                    <td style="vertical-align: top;">Makan minum (jika makan harus berupa potongan, dianggap dibantu)</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1<br>2</td>
                    <td style="vertical-align: top;">
                        Tidak mampu<br>
                        Perlu ditolong memotong makanan<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310046]) ? '0' : (!empty($item[310047]) ? '1' : (!empty($item[310048]) ? '2' : '')) !!}
                    </td>
                </tr>
                <!-- 6. Perpindahan -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">6</td>
                    <td style="vertical-align: top;">Bergerak dari kursi roda ke tempat tidur dan sebaliknya (termasuk duduk di tempat tidur)</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1<br>2<br>3</td>
                    <td style="vertical-align: top;">
                        Tidak mampu<br>
                        Perlu banyak bantuan untuk bisa duduk (2 orang)<br>
                        Bantuan minimal 1 orang<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310049]) ? '0' : (!empty($item[310050]) ? '1' : (!empty($item[310051]) ? '2' : (!empty($item[310052]) ? '3' : ''))) !!}
                    </td>
                </tr>
                <!-- 7. Berjalan -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">7</td>
                    <td style="vertical-align: top;">Berjalan di tempat rata (atau jika tidak bisa berjalan, menjalankan kursi roda)</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1<br>2<br>3</td>
                    <td style="vertical-align: top;">
                        Tidak mampu<br>
                        Bisa (pindah) dengan kursi roda<br>
                        Berjalan dengan bantuan 1 orang<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310053]) ? '0' : (!empty($item[310054]) ? '1' : (!empty($item[310055]) ? '2' : (!empty($item[310056]) ? '3' : ''))) !!}
                    </td>
                </tr>
                <!-- 8. Berpakaian -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">8</td>
                    <td style="vertical-align: top;">Berpakaian (termasuk memasang tali sepatu, mengencangkan sabuk)</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1<br>2</td>
                    <td style="vertical-align: top;">
                        Tergantung orang lain<br>
                        Sebagian dibantu (misal: mengancing baju)<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310057]) ? '0' : (!empty($item[310058]) ? '1' : (!empty($item[310059]) ? '2' : '')) !!}
                    </td>
                </tr>
                <!-- 9. Naik turun tangga -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">9</td>
                    <td style="vertical-align: top;">Naik turun tangga</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1<br>2</td>
                    <td style="vertical-align: top;">
                        Tidak mampu<br>
                        Butuh pertolongan<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310060]) ? '0' : (!empty($item[310061]) ? '1' : (!empty($item[310062]) ? '2' : '')) !!}
                    </td>
                </tr>
                <!-- 10. Mandi -->
                <tr>
                    <td class="text-center" style="vertical-align: top;">10</td>
                    <td style="vertical-align: top;">Mandi</td>
                    <td class="text-center" style="vertical-align: top;">0<br>1</td>
                    <td style="vertical-align: top;">
                        Tergantung orang lain<br>
                        Mandiri
                    </td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310063]) ? '0' : (!empty($item[310064]) ? '1' : ' ') !!}
                    </td>
                </tr>
                <!-- Skor Total -->
                <tr style="font-weight: bold;">
                    <td colspan="4" class="text-center">Skor Total</td>
                    <td class="text-center">{!! isset($item[310065]) ? $item[310065] : '' !!}</td>
                </tr>
            </tbody>
        </table>

        <!-- Box Keterangan Skor Barthel -->
        <table style="width: 40%; margin-bottom: 12px; border-collapse: collapse;">
            <tr>
                <td style="border: 1px solid #000; border-radius: 5px; padding: 4px 6px; font-size: 8pt; line-height: 1.2;">
                    <b>Skor Modifikasi Barthel Indeks :</b><br>
                    <table style="border: none; width: 100%;">
                        <tr><td style="border: none; padding: 0; width: 40px;">20</td><td style="border: none; padding: 0;">: Mandiri</td></tr>
                        <tr><td style="border: none; padding: 0;">12 - 19</td><td style="border: none; padding: 0;">: Ketergantungan ringan</td></tr>
                        <tr><td style="border: none; padding: 0;">9 - 11</td><td style="border: none; padding: 0;">: Ketergantungan sedang</td></tr>
                        <tr><td style="border: none; padding: 0;">5 - 8</td><td style="border: none; padding: 0;">: Ketergantungan berat</td></tr>
                        <tr><td style="border: none; padding: 0;">0 - 4</td><td style="border: none; padding: 0;">: Ketergantungan total</td></tr>
                    </table>
                    <div style="margin-top: 4px; font-weight: bold;">Skor &lt;= 11 lapor DPJP untuk penanganan lebih lanjut</div>
                </td>
            </tr>
        </table>

        <!-- Section IX-b: IADL Lawton -->
        <div style="padding-left: 0; margin-bottom: 4px; font-size: 8.5pt;">b. Penilaian <i>Instrumental Activity of Daily Living</i> (IADL) dengan Instrumen Lawton</div>
        <table class="content-table" style="width: 100%; table-layout: fixed; margin-bottom: 0px;">
            <thead>
                <tr>
                    <th style="width: 82%; text-align: left;"></th>
                    <th style="width: 9%;">SKOR</th>
                    <th style="width: 9%;">HASIL</th>
                </tr>
            </thead>
            <tbody>
                <!-- 1. Telepon -->
                <tr>
                    <td style="vertical-align: top;">
                        <span style="font-weight: bold;">Dapat menggunakan telepon</span><br>
                        <span style="padding-left: 10px; display: block;">Mengoperasikan telepon sendiri dan mencari dan menghubungi nomor</span>
                        <span style="padding-left: 10px; display: block;">Menghubungi beberapa nomor yang diketahui</span>
                        <span style="padding-left: 10px; display: block;">Menjawab telepon tetapi tidak menghubungi</span>
                        <span style="padding-left: 10px; display: block;">Tidak bisa menggunakan telepon sama sekali</span>
                    </td>
                    <td class="text-center" style="vertical-align: top;">1<br>1<br>1<br>0</td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310067]) ? '1' : (!empty($item[310068]) ? '1' : (!empty($item[310069]) ? '1' : (!empty($item[310070]) ? '0' : ''))) !!}
                    </td>
                </tr>
                <!-- 2. Bepergian -->
                <tr>
                    <td style="vertical-align: top;">
                        <span style="font-weight: bold;">Mampu pergi ke suatu tempat</span><br>
                        <span style="padding-left: 10px; display: block;">Berpergian sendiri menggunakan kendaraan umum atau menyetir sendiri</span>
                        <span style="padding-left: 10px; display: block;">Mengatur perjalanan sendiri</span>
                        <span style="padding-left: 10px; display: block;">Perjalanan menggunakan transportasi umum jika ada yang menyertai</span>
                        <span style="padding-left: 10px; display: block;">Tidak melakukan perjalanan sama sekali</span>
                    </td>
                    <td class="text-center" style="vertical-align: top;">1<br>1<br>0<br>0</td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310071]) ? '1' : (!empty($item[310072]) ? '1' : (!empty($item[310073]) ? '0' : (!empty($item[310074]) ? '0' : ''))) !!}
                    </td>
                </tr>
                <!-- 3. Belanja -->
                <tr>
                    <td style="vertical-align: top;">
                        <span style="font-weight: bold;">Dapat berbelanja</span><br>
                        <span style="padding-left: 10px; display: block;">Mengatur semua kebutuhan belanja sendiri</span>
                        <span style="padding-left: 10px; display: block;">Perlu bantuan untuk mengantar belanja</span>
                        <span style="padding-left: 10px; display: block;">Sama sekali tidak mampu belanja</span>
                    </td>
                    <td class="text-center" style="vertical-align: top;">1<br>0<br>0</td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310075]) ? '1' : (!empty($item[310076]) ? '0' : (!empty($item[310077]) ? '0' : '')) !!}
                    </td>
                </tr>
                <!-- 4. Menyiapkan makanan -->
                <tr>
                    <td style="vertical-align: top;">
                        <span style="font-weight: bold;">Dapat menyiapkan makanan</span><br>
                        <span style="padding-left: 10px; display: block;">Merencanakan, menyiapkan dan menghidangkan makanan</span>
                        <span style="padding-left: 10px; display: block;">Menyiapkan makanan jika sudah tersedia bahan makanan</span>
                        <span style="padding-left: 10px; display: block;">Menyiapkan makanan tetapi tidak mengatur diet yang cukup</span>
                        <span style="padding-left: 10px; display: block;">Perlu disiapkan dan dilayani</span>
                    </td>
                    <td class="text-center" style="vertical-align: top;">1<br>0<br>0<br>0</td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310078]) ? '1' : (!empty($item[310079]) ? '0' : (!empty($item[310080]) ? '0' : (!empty($item[310081]) ? '0' : ''))) !!}
                    </td>
                </tr>
                <!-- 5. Pekerjaan rumah -->
                <tr>
                    <td style="vertical-align: top;">
                        <span style="font-weight: bold;">Dapat melakukan pekerjaan rumah tangga</span><br>
                        <span style="padding-left: 10px; display: block;">Merawat rumah sendiri atau bantuan kadang-kadang</span>
                        <span style="padding-left: 10px; display: block;">Mengerjakan pekerjaan ringan sehari-hari (merapikan tempat tidur, mencuci piring)</span>
                        <span style="padding-left: 10px; display: block;">Perlu bantuan untuk semua perawatan rumah sehari-hari</span>
                        <span style="padding-left: 10px; display: block;">Tidak berpartisipasi dalam perawatan rumah</span>
                    </td>
                    <td class="text-center" style="vertical-align: top;">1<br>1<br>1<br>1</td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310082]) ? '1' : (!empty($item[310083]) ? '1' : (!empty($item[310084]) ? '1' : (!empty($item[310085]) ? '1' : ''))) !!}
                    </td>
                </tr>
                <!-- 6. Mencuci pakaian -->
                <tr>
                    <td style="vertical-align: top;">
                        <span style="font-weight: bold;">Dapat mencuci pakaian</span><br>
                        <span style="padding-left: 10px; display: block;">Mencuci semua pakaian sendiri</span>
                        <span style="padding-left: 10px; display: block;">Mencuci pakaian yang kecil</span>
                        <span style="padding-left: 10px; display: block;">Semua pakaian dicuci oleh orang lain</span>
                    </td>
                    <td class="text-center" style="vertical-align: top;">1<br>1<br>0</td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310086]) ? '1' : (!empty($item[310087]) ? '1' : (!empty($item[310088]) ? '0' : '')) !!}
                    </td>
                </tr>
                <!-- 7. Obat-obatan -->
                <tr>
                    <td style="vertical-align: top;">
                        <span style="font-weight: bold;">Dapat mengatur obat-obatan</span><br>
                        <span style="padding-left: 10px; display: block;">Meminum obat secara tepat dosis dan waktu tanpa bantuan</span>
                        <span style="padding-left: 10px; display: block;">Tidak mampu menyiapkan obat sendiri</span>
                    </td>
                    <td class="text-center" style="vertical-align: top;">1<br>0</td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310089]) ? '1' : (!empty($item[310090]) ? '0' : ' ') !!}
                    </td>
                </tr>
                <!-- 8. Keuangan -->
                <tr>
                    <td style="vertical-align: top;">
                        <span style="font-weight: bold;">Dapat mengatur keuangan</span><br>
                        <span style="padding-left: 10px; display: block;">Mengatur masalah finansial (tagihan, pergi ke bank)</span>
                        <span style="padding-left: 10px; display: block;">Mengatur pengeluaran sehari-hari, tapi perlu bantuan untuk ke bank untuk transaksi penting</span>
                        <span style="padding-left: 10px; display: block;">Tidak mampu mengambil keputusan finansial atau memegang uang</span>
                    </td>
                    <td class="text-center" style="vertical-align: top;">1<br>1<br>0</td>
                    <td class="text-center" style="vertical-align: middle; font-weight: bold;">
                        {!! !empty($item[310091]) ? '1' : (!empty($item[310092]) ? '1' : (!empty($item[310093]) ? '0' : '')) !!}
                    </td>
                </tr>
                <!-- Skor Total -->
                <tr style="font-weight: bold;">
                    <td class="text-center">Skor Total</td>
                    <td class="text-center">8</td>
                    <td class="text-center">{!! isset($item[310094]) ? $item[310094] : '' !!}</td>
                </tr>
            </tbody>
        </table>

        <!-- Box Keterangan Skor IADL -->
        <table style="width: 60%; margin-top: 5px; margin-bottom: 12px; border-collapse: collapse;">
            <tr>
                <td style="width: 50%;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 8pt;">
                        <tr>
                            <td style="border: 1px solid #000; padding: 2px 6px; font-weight: bold; text-align: center;" colspan="2">Skor IADL</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 2px 6px;">Dikerjakan oleh orang lain</td>
                            <td style="border: 1px solid #000; padding: 2px 6px; text-align: center; width: 30px;">0</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 2px 6px;">Perlu bantuan sepanjang waktu</td>
                            <td style="border: 1px solid #000; padding: 2px 6px; text-align: center;">1</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 2px 6px;">Perlu bantuan sesekali</td>
                            <td style="border: 1px solid #000; padding: 2px 6px; text-align: center;">2</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 2px 6px;">Independen / mandiri</td>
                            <td style="border: 1px solid #000; padding: 2px 6px; text-align: center;">3 - 8</td>
                        </tr>
                    </table>
                </td>
                <td style="width: 50%; padding-left: 15px; font-size: 8pt; vertical-align: middle;">
                    *Lingkari skor dan tuliskan hasil
                </td>
            </tr>
        </table>
        <!-- Section X: Skrining Nyeri -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 10px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">X.</td>
                <td>Skrining Nyeri ( diisi perawat )</td>
            </tr>
        </table>

        @php
            $selectedWongBaker = '';
            if (!empty($item[310108])) $selectedWongBaker = '0';
            elseif (!empty($item[310109])) $selectedWongBaker = '1-2-3';
            elseif (!empty($item[310110])) $selectedWongBaker = '4';
            elseif (!empty($item[310111])) $selectedWongBaker = '5-6-7';
            elseif (!empty($item[310112])) $selectedWongBaker = '8';
            elseif (!empty($item[310113])) $selectedWongBaker = '9-10';

            $selectedNumeric = '';
            if (!empty($item[310114])) $selectedNumeric = '0';
            elseif (!empty($item[310115])) $selectedNumeric = '1-3';
            elseif (!empty($item[310116])) $selectedNumeric = '4-6';
            elseif (!empty($item[310117])) $selectedNumeric = '7-10';

            $skorNyeri = '';
            if (isset($item[3016561]) && trim($item[3016561]) !== '') {
                $skorNyeri = $item[3016561];
            } elseif (isset($item[310118]) && trim($item[310118]) !== '') {
                $skorNyeri = $item[310118];
            } else {
                $parts = [];
                if ($selectedWongBaker !== '') $parts[] = $selectedWongBaker . ' (Wong Baker)';
                if ($selectedNumeric !== '') $parts[] = $selectedNumeric . ' (Numeric)';
                $skorNyeri = !empty($parts) ? implode(' / ', $parts) : '..........';
            }
        @endphp

        <table style="width: 100%; margin-left: 50px; margin-top: 4px; font-size: 8.5pt; border-collapse: collapse;">
            <tr>
                <td style="font-weight: bold; padding: 2px 0;" colspan="2">Keluhan Nyeri :</td>
            </tr>
            <tr>
                <td style="width: 20px; padding: 2px 0; vertical-align: middle;">
                    <span class="check-box">{!! !empty($item[310097]) ? $checkmark : '&nbsp;' !!}</span>
                </td>
                <td style="padding: 2px 0; font-size: 8.5pt;">Tidak ada</td>
            </tr>
            <tr>
                <td style="width: 20px; padding: 2px 0; vertical-align: middle;">
                    <span class="check-box">{!! !empty($item[310098]) ? $checkmark : '&nbsp;' !!}</span>
                </td>
                <td style="padding: 2px 0; font-size: 8.5pt;">
                    Ada, Lokasi {!! isset($item[310098]) && trim($item[310098]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px;">' . $item[310098] . '</span>' : '........................................................................................' !!}
                    Durasi {!! isset($item[310099]) && trim($item[310099]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px;">' . $item[310099] . '</span>' : '................................................................' !!}
                </td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding: 6px 0 4px 0;" colspan="2">
                    Skor Nyeri : {!! $skorNyeri !!}
                </td>
            </tr>
        </table>

        <!-- Wong Baker scale -->
        <div style="text-align: center; font-weight: bold; font-style: italic; text-decoration: underline; margin-top: 10px; font-size: 9pt;">WONG BAKER FACES</div>
        
        <table style="width: 100%; border-collapse: collapse; border: none; margin-top: 10px; margin-bottom: 15px;">
            <tr>
                <!-- Left: Faces -->
                <td style="width: 62%; border: none; vertical-align: middle; padding: 0;">
                    <table style="width: 100%; border-collapse: collapse; border: none; table-layout: fixed;">
                        <!-- Row 1: Images -->
                        <tr>
                            <td style="width: 13%; text-align: center; border: none; padding: 0;"><img style="height: 30px; width: auto;" src="{{ public_path('img/skalanyeri/1.png') }}"></td>
                            <td style="width: 4.4%; border: none;"></td>
                            <td style="width: 13%; text-align: center; border: none; padding: 0;"><img style="height: 30px; width: auto;" src="{{ public_path('img/skalanyeri/2.png') }}"></td>
                            <td style="width: 4.4%; border: none;"></td>
                            <td style="width: 13%; text-align: center; border: none; padding: 0;"><img style="height: 30px; width: auto;" src="{{ public_path('img/skalanyeri/3.png') }}"></td>
                            <td style="width: 4.4%; border: none;"></td>
                            <td style="width: 13%; text-align: center; border: none; padding: 0;"><img style="height: 30px; width: auto;" src="{{ public_path('img/skalanyeri/4.png') }}"></td>
                            <td style="width: 4.4%; border: none;"></td>
                            <td style="width: 13%; text-align: center; border: none; padding: 0;"><img style="height: 30px; width: auto;" src="{{ public_path('img/skalanyeri/5.png') }}"></td>
                            <td style="width: 4.4%; border: none;"></td>
                            <td style="width: 13%; text-align: center; border: none; padding: 0;"><img style="height: 30px; width: auto;" src="{{ public_path('img/skalanyeri/6.png') }}"></td>
                        </tr>
                        <!-- Row 2: Numbers -->
                        <tr>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">0</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">1</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">2</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">3</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">4</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">5</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">6</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">7</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">8</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">9</td>
                            <td style="text-align: center; font-size: 8pt; font-weight: bold; border: none; padding: 2px 0 0 0;">10</td>
                        </tr>
                        <!-- Row 3: Labels -->
                        <tr>
                            <td style="text-align: center; font-size: 7pt; line-height: 1.1; border: none; padding: 2px 0 0 0; vertical-align: top;">Tidak Nyeri</td>
                            <td style="border: none;"></td>
                            <td style="text-align: center; font-size: 7pt; line-height: 1.1; border: none; padding: 2px 0 0 0; vertical-align: top;">Sedikit Nyeri</td>
                            <td style="border: none;"></td>
                            <td style="text-align: center; font-size: 7pt; line-height: 1.1; border: none; padding: 2px 0 0 0; vertical-align: top;">Agak<br>Mengganggu</td>
                            <td style="border: none;"></td>
                            <td style="text-align: center; font-size: 7pt; line-height: 1.1; border: none; padding: 2px 0 0 0; vertical-align: top;">Mengganggu<br>Aktivitas</td>
                            <td style="border: none;"></td>
                            <td style="text-align: center; font-size: 7pt; line-height: 1.1; border: none; padding: 2px 0 0 0; vertical-align: top;">Sangat<br>Mengganggu</td>
                            <td style="border: none;"></td>
                            <td style="text-align: center; font-size: 7pt; line-height: 1.1; border: none; padding: 2px 0 0 0; vertical-align: top;">Tak<br>Tertahankan</td>
                        </tr>
                    </table>
                </td>
                <!-- Right: Checkboxes -->
                <td style="width: 38%; border: none; vertical-align: top; padding-left: 15px;">
                    <div style="font-weight: bold; font-size: 8pt; margin-bottom: 4px;">Score :</div>
                    <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8pt; line-height: 1.35;">
                        <tr>
                            <td style="width: 15px; padding: 2px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310108]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 2px 0; vertical-align: middle;">0 = Tidak Ada Nyeri</td>
                        </tr>
                        <tr>
                            <td style="width: 15px; padding: 2px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310109]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 2px 0; vertical-align: middle;">1 - 2 - 3 = Sedikit Nyeri</td>
                        </tr>
                        <tr>
                            <td style="width: 15px; padding: 2px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310110]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 2px 0; vertical-align: middle;">4 = Agak mengganggu</td>
                        </tr>
                        <tr>
                            <td style="width: 15px; padding: 2px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310111]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 2px 0; vertical-align: middle;">5 - 6 - 7 = Mengganggu aktivitas</td>
                        </tr>
                        <tr>
                            <td style="width: 15px; padding: 2px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310112]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 2px 0; vertical-align: middle;">8 = Sangat mengganggu</td>
                        </tr>
                        <tr>
                            <td style="width: 15px; padding: 2px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310113]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 2px 0; vertical-align: middle;">9 - 10 = Tak Tertahankan</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Numeric scale -->
        <div style="text-align: center; font-weight: bold; font-style: italic; text-decoration: underline; margin-top: 15px; font-size: 9pt;">NUMERIC</div>
        <table style="width: 100%; border-collapse: collapse; border: none; margin-top: 10px; margin-bottom: 10px;">
            <tr>
                <!-- Left: Scale image -->
                <td style="width: 62%; border: none; text-align: center; vertical-align: middle; padding: 0;">
                    <img style="width: 360px; height: auto;" src="{{ public_path('img/skalanyeri/numericPainRatingScale2.png') }}">
                </td>
                <!-- Right: Checkboxes -->
                <td style="width: 38%; border: none; vertical-align: top; padding-left: 15px;">
                    <div style="font-weight: bold; font-size: 8pt; margin-bottom: 4px;">Score :</div>
                    <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8pt; line-height: 1.4;">
                        <tr>
                            <td style="width: 15px; padding: 3px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310114]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 3px 0; vertical-align: middle;">0 = Tidak Nyeri</td>
                        </tr>
                        <tr>
                            <td style="width: 15px; padding: 3px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310115]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 3px 0; vertical-align: middle;">1 - 3 = Nyeri Ringan</td>
                        </tr>
                        <tr>
                            <td style="width: 15px; padding: 3px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310116]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 3px 0; vertical-align: middle;">4 - 6 = Nyeri Sedang</td>
                        </tr>
                        <tr>
                            <td style="width: 15px; padding: 3px 0; vertical-align: middle;"><span class="check-box">{!! !empty($item[310117]) ? $checkmark : '&nbsp;' !!}</span></td>
                            <td style="padding: 3px 0; vertical-align: middle;">7 - 10 = Nyeri Berat</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Section XI: Skrining Risiko Jatuh -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 15px;">
            <tr>
                <td style="width: 30px; padding-left: 20px;">XI.</td>
                <td>Skrining Risiko Jatuh ( diisi perawat )</td>
            </tr>
        </table>

        <table class="content-table" style="width: 100%; table-layout: fixed; margin-top: 5px; margin-bottom: 8px;">
            <thead>
                <tr>
                    <th style="width: 4%;">No</th>
                    <th style="width: 76%; text-align: center;">Penilaian</th>
                    <th style="width: 10%;">Ya</th>
                    <th style="width: 10%;">Tidak</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center" style="vertical-align: middle;">1</td>
                    <td style="font-weight: bold;">Cara berjalan pasien ( salah satu / lebih )</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td style="padding-left: 15px;">a. Tidak seimbang / sempoyongan / limbung</td>
                    <td class="text-center" style="vertical-align: middle;">
                        <span class="check-box">{!! !empty($item[310120]) ? $checkmark : '&nbsp;' !!}</span>
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <span class="check-box">{!! !empty($item[310121]) ? $checkmark : '&nbsp;' !!}</span>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td style="padding-left: 15px;">b. Jalan dengan alat bantu ( kruk, tripot, kursi roda, orang lain )</td>
                    <td class="text-center" style="vertical-align: middle;">
                        <span class="check-box">{!! !empty($item[310122]) ? $checkmark : '&nbsp;' !!}</span>
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <span class="check-box">{!! !empty($item[310123]) ? $checkmark : '&nbsp;' !!}</span>
                    </td>
                </tr>
                <tr>
                    <td class="text-center" style="vertical-align: middle;">2</td>
                    <td>Ada keterbatasan gerak</td>
                    <td class="text-center" style="vertical-align: middle;">
                        <span class="check-box">{!! !empty($item[310124]) ? $checkmark : '&nbsp;' !!}</span>
                    </td>
                    <td class="text-center" style="vertical-align: middle;">
                        <span class="check-box">{!! !empty($item[310125]) ? $checkmark : '&nbsp;' !!}</span>
                    </td>
                </tr>
            </tbody>
        </table>

        <table style="width: 100%; margin-top: 5px; font-size: 8.5pt; border-collapse: collapse; line-height: 1.35;">
            <tr>
                <td style="width: 20px; padding: 2px 0; vertical-align: middle;">
                    <span class="check-box">{!! !empty($item[310126]) ? $checkmark : '&nbsp;' !!}</span>
                </td>
                <td style="padding: 2px 0;">Tidak Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point 1 / 2</td>
            </tr>
            <tr>
                <td style="width: 20px; padding: 2px 0; vertical-align: middle;">
                    <span class="check-box">{!! !empty($item[310127]) ? $checkmark : '&nbsp;' !!}</span>
                </td>
                <td style="padding: 2px 0;">Ada Risiko Jatuh, bila ditemukan salah satu dari point 1 / 2</td>
            </tr>
            <tr>
                <td style="width: 20px; padding: 2px 0; vertical-align: middle;">
                    <span class="check-box">{!! !empty($item[310128]) ? $checkmark : '&nbsp;' !!}</span>
                </td>
                <td style="padding: 2px 0;">Risiko Jatuh Tinggi, bila ditemukan 1 dan 2</td>
            </tr>
        </table>

        @php
            $idEdukasi = \DB::table('emrd_t')
                ->where('emrfk', 3000921)
                ->where('caption', 'Edukasi')
                ->value('id');
            $idTanda = \DB::table('emrd_t')
                ->where('emrfk', 3000921)
                ->where('caption', 'Pemberian Tanda Risiko Jatuh')
                ->value('id');
            $idDuduk = \DB::table('emrd_t')
                ->where('emrfk', 3000921)
                ->where('caption', 'Pemberian Tempat Duduk Prioritas')
                ->value('id');
        @endphp

        <table style="width: 100%; margin-top: 4px; font-size: 8.5pt; border-collapse: collapse; line-height: 1.35;">
            <tr>
                <td style="width: 65px; font-weight: bold; vertical-align: top; padding: 2px 0;">Tindakan :</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="width: 20px; padding: 1px 0; vertical-align: middle;">
                                <span class="check-box">{!! !empty($idEdukasi) && !empty($item[$idEdukasi]) ? $checkmark : '&nbsp;' !!}</span>
                            </td>
                            <td style="padding: 1px 0;">Edukasi</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; padding: 1px 0; vertical-align: middle;">
                                <span class="check-box">{!! !empty($idTanda) && !empty($item[$idTanda]) ? $checkmark : '&nbsp;' !!}</span>
                            </td>
                            <td style="padding: 1px 0;">Pemberian Tanda Risiko Jatuh</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; padding: 1px 0; vertical-align: middle;">
                                <span class="check-box">{!! !empty($idDuduk) && !empty($item[$idDuduk]) ? $checkmark : '&nbsp;' !!}</span>
                            </td>
                            <td style="padding: 1px 0;">Pemberian Tempat Duduk Prioritas</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Section XII: Risiko Luka Tekan dengan Skala Norton -->
        <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-top: 15px;">
            <tr>
                <td style="width: 35px; padding-left: 20px;">XII.</td>
                <td>Risiko Luka Tekan dengan Skala Norton ( diisi perawat )</td>
            </tr>
        </table>

        <table class="content-table" style="width: 100%; table-layout: fixed; margin-top: 5px; margin-bottom: 6px;">
            <thead>
                <tr>
                    <th style="width: 20%;">Penilaian</th>
                    <th style="width: 20%;">4</th>
                    <th style="width: 20%;">3</th>
                    <th style="width: 20%;">2</th>
                    <th style="width: 20%;">1</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-weight: bold; vertical-align: middle;">Kondisi Fisik</td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310131]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Baik</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310132]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Sedang</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310133]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Buruk</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310134]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Sangat Buruk</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; vertical-align: middle;">Status Mental</td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310136]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Sadar</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310137]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Apatis</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310138]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Bingung</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310139]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Stupor</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; vertical-align: middle;">Aktivitas</td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310141]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Jalan sendiri</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310142]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Jalan dengan bantuan</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310143]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Kursi roda</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310144]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">di tempat tidur</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; vertical-align: middle;">Mobilitas</td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310146]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Bebas bergerak</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310147]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Agak terbatas</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310148]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Sangat terbatas</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310149]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Tidak mampu bergerak</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; vertical-align: middle;">Inkontinensia</td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310151]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Kontinen</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310152]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Kadang-kadang inkontinensia urin</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310153]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Sering inkontinensia urin</div>
                        </div>
                    </td>
                    <td style="vertical-align: top; padding: 4px 6px;">
                        <div class="cb-container">
                            <div class="cb-cell-box"><span class="check-box">{!! !empty($item[310154]) ? $checkmark : '&nbsp;' !!}</span></div>
                            <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">Inkontinensia urin et alvi</div>
                        </div>
                    </td>
                </tr>
                <tr style="font-weight: bold; background-color: #f2f2f2;">
                    <td colspan="4" class="text-right" style="padding: 4px 6px;">Skor Total =</td>
                    <td class="text-center" style="padding: 4px 6px;">{!! isset($item[310155]) ? $item[310155] : '-' !!}</td>
                </tr>
            </tbody>
        </table>

        <div style="font-size: 8.5pt; line-height: 1.35; margin-top: 5px;">
            <b>Skor :</b><br>
            <table style="border: none; margin: 0; padding: 0;">
                <tr>
                    <td style="border: none; padding: 1px 0; width: 60px;">&gt;18</td>
                    <td style="border: none; padding: 1px 0;">: risiko rendah</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 1px 0;">14 - 18</td>
                    <td style="border: none; padding: 1px 0;">: risiko menengah</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 1px 0;">10 - &lt;14</td>
                    <td style="border: none; padding: 1px 0;">: risiko tinggi</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 1px 0;">&lt;10</td>
                    <td style="border: none; padding: 1px 0;">: risiko sangat tinggi</td>
                </tr>
            </table>
        </div>

        <!-- Section XIII: Skrining Risiko Nutrisional -->
        <div style="page-break-inside: avoid; margin-top: 15px;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XIII.</td>
                    <td>Skrining Risiko Nutrisional ( diisi perawat )</td>
                </tr>
            </table>

            <table class="content-table" style="width: 100%; table-layout: fixed; margin-top: 5px; margin-bottom: 6px;">
                <thead>
                    <tr>
                        <th style="width: 6%; text-align: center;">No</th>
                        <th style="width: 54%; text-align: center;">Pertanyaan Skrining</th>
                        <th style="width: 40%; text-align: center;">Pilihan Jawaban (Pilih Salah Satu)</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- A -->
                    <tr>
                        <td class="text-center text-bold" style="vertical-align: middle;">A</td>
                        <td>Apakah asupan makanan berkurang selama 3 bulan terakhir?</td>
                        <td style="vertical-align: top; padding: 4px 6px;">
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310041]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">0 = Asupan makanan sangat berkurang</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310042]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">1 = Asupan makanan agak berkurang</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310043]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">2 = Asupan makanan tidak berkurang</div>
                            </div>
                        </td>
                    </tr>
                    <!-- B -->
                    <tr>
                        <td class="text-center text-bold" style="vertical-align: middle;">B</td>
                        <td>Berat badan turun selama 3 bulan terakhir?</td>
                        <td style="vertical-align: top; padding: 4px 6px;">
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310044]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">0 = Berat badan turun lebih dari 3 kg</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310045]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">1 = Tidak tahu</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310046]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">2 = Berat badan turun antara 1 hingga 3 kg</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310047]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">3 = Berat badan tidak turun</div>
                            </div>
                        </td>
                    </tr>
                    <!-- C -->
                    <tr>
                        <td class="text-center text-bold" style="vertical-align: middle;">C</td>
                        <td>Pergerakan atau Mobilitas?</td>
                        <td style="vertical-align: top; padding: 4px 6px;">
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310048]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">0 = Terbatas di tempat tidur atau kursi</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310049]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">1 = Mampu bangun dari tempat tidur/kursi, tapi tidak bisa keluar</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310050]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">2 = Dapat bepergian ke luar rumah</div>
                            </div>
                        </td>
                    </tr>
                    <!-- D -->
                    <tr>
                        <td class="text-center text-bold" style="vertical-align: middle;">D</td>
                        <td>Mengalami tekanan psikologis atau penyakit akut (3 bln terakhir)?</td>
                        <td style="vertical-align: top; padding: 4px 6px;">
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310051]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">0 = Ya</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310052]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">2 = Tidak</div>
                            </div>
                        </td>
                    </tr>
                    <!-- E -->
                    <tr>
                        <td class="text-center text-bold" style="vertical-align: middle;">E</td>
                        <td>Gangguan neuropsikologis</td>
                        <td style="vertical-align: top; padding: 4px 6px;">
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310053]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">0 = Demensia berat atau depresi</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310054]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">1 = Demensia ringan</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310055]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">2 = Tidak ada gangguan psikologis</div>
                            </div>
                        </td>
                    </tr>
                    <!-- F1 -->
                    <tr>
                        <td class="text-center text-bold" style="vertical-align: middle;">F1</td>
                        <td>Indeks Massa Tubuh (IMT)</td>
                        <td style="vertical-align: top; padding: 4px 6px;">
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310056]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">0 = IMT kurang dari 19</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310057]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">1 = IMT 19 hingga kurang dari 21</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310058]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">2 = IMT 21 hingga kurang dari 23</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310059]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">3 = IMT 23 atau lebih besar</div>
                            </div>
                        </td>
                    </tr>
                    <!-- F2 -->
                    <tr>
                        <td class="text-center text-bold" style="vertical-align: middle;">F2</td>
                        <td>Lingkar lengan atas (LiLA) - Jika IMT tidak dapat diukur</td>
                        <td style="vertical-align: top; padding: 4px 6px;">
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310060]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">0,0 = LiLA kurang dari 21</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310061]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">0,5 = LiLA 21 hingga 22</div>
                            </div>
                            <div class="cb-container">
                                <div class="cb-cell-box"><span class="check-box">{!! !empty($item[1901310062]) ? $checkmark : '&nbsp;' !!}</span></div>
                                <div class="cb-cell-text" style="font-size: 7.8pt; line-height: 1.1;">1,0 = LiLA lebih dari 22</div>
                            </div>
                        </td>
                    </tr>
                    <!-- Total Skor -->
                    <tr style="font-weight: bold; background-color: #f2f2f2;">
                        <td colspan="2" class="text-right" style="padding: 6px; font-size: 8.5pt;">TOTAL SKOR MNA (Max. 14) :</td>
                        <td class="text-center" style="padding: 6px; font-size: 9pt;">{!! isset($item[1901310063]) ? $item[1901310063] : '-' !!}</td>
                    </tr>
                </tbody>
            </table>

            <div style="border: 1px solid #000; padding: 6px 10px; margin-top: 5px; font-size: 8.5pt; line-height: 1.35;">
                <b>Interpretasi Skor:</b><br>
                <table style="border: none; margin: 0; padding: 0;">
                    <tr>
                        <td style="border: none; padding: 1px 0; width: 60px;">12 - 14</td>
                        <td style="border: none; padding: 1px 0;">: Status Gizi Normal</td>
                    </tr>
                    <tr>
                        <td style="border: none; padding: 1px 0;">8 - 11</td>
                        <td style="border: none; padding: 1px 0;">: Berisiko Malnutrisi</td>
                    </tr>
                    <tr>
                        <td style="border: none; padding: 1px 0;">0 - 7</td>
                        <td style="border: none; padding: 1px 0;">: Malnutrisi</td>
                    </tr>
                </table>
            </div>

            {{--
            <!-- Diagnosis Khusus -->
            <table style="width: 100%; margin-top: 10px; font-size: 8.5pt; line-height: 1.4;">
                <tr>
                    <td style="width: 180px; font-weight: bold; vertical-align: top;">Pasien dengan diagnosa khusus :</td>
                    <td style="vertical-align: top;">
                        <span class="check-box">{!! !empty($item[310167]) && $item[310167] == 'Ya' ? $checkmark : '&nbsp;' !!}</span> Ya
                        <span style="margin-left: 30px;"><span class="check-box">{!! !empty($item[310167]) && $item[310167] == 'Tidak' ? $checkmark : '&nbsp;' !!}</span> Tidak</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding-top: 5px;">
                        <div style="font-weight: bold;">DM / Hipertensi / Geriatri / Infeksi TB / Infeksi Hepatitis / Lain-lain Sebutkan :</div>
                        <div style="border-bottom: 1px dotted #000; min-height: 18px; padding: 2px 5px; margin-top: 3px;">
                            {{ $item[310168] ?? '-' }}
                        </div>
                    </td>
                </tr>
            </table>
            --}}

            {{--
            <!-- Kesimpulan -->
            <div style="margin-top: 12px; font-size: 8.5pt; line-height: 1.4;">
                <div style="font-weight: bold;">KESIMPULAN :</div>
                <div style="font-style: italic; margin-top: 3px;">
                    *) Bila skor &gt; 2 dan atau pasien dengan diagnosis / kondisi khusus, kolaborasi dengan dokter dan or dengan ahli gizi
                </div>
            </div>
            --}}
        </div>

        <!-- Section XIV: Penilaian Mini Mental State Examination (MMSE) -->
        <div style="page-break-inside: avoid; margin-top: 15px;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XIV.</td>
                    <td>Penilaian Mini Mental State Examination ( MMSE )</td>
                </tr>
            </table>

            <table class="content-table" style="width: 100%; table-layout: fixed; margin-top: 5px; margin-bottom: 6px;">
                <thead>
                    <tr>
                        <th style="width: 8%; text-align: center;">BUTIR</th>
                        <th style="width: 72%; text-align: center;">TES</th>
                        <th style="width: 10%; text-align: center;">NILAI MAKS</th>
                        <th style="width: 10%; text-align: center;">NILAI</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 1 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">1</td>
                        <td style="vertical-align: top;">
                            <div style="font-weight: bold; margin-bottom: 2px;">ORIENTASI</div>
                            Sekarang (tahun), (musim), (bulan), (tanggal), hari apa ?
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">5</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310172]) ? $item[310172] : '-' !!}</td>
                    </tr>
                    <!-- 2 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">2</td>
                        <td style="vertical-align: top;">
                            Kita berada dimana ? (negara), (propinsi), (kota), (gedung), (ruang), (tanyakan pada responden)
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">5</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310173]) ? $item[310173] : '-' !!}</td>
                    </tr>
                    <!-- 3 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">3</td>
                        <td style="vertical-align: top;">
                            <div style="font-weight: bold; margin-bottom: 2px;">REGISTRASI</div>
                            Pemeriksa menyebut 3 benda yang berbeda kelompoknya selang 1 detik (misal apel, uang, meja), responden diminta mengulangnya. Nilai 1 untuk tiap nama benda yang benar. Ulangi sampai responden dapat menyebutkan dengan benar dan catat jumlah pengulangan
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">3</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310174]) ? $item[310174] : '-' !!}</td>
                    </tr>
                    <!-- 4 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">4</td>
                        <td style="vertical-align: top;">
                            <div style="font-weight: bold; margin-bottom: 2px;">ATENSI DAN KALKULASI</div>
                            Pengurangan 100 dengan 7 secara berurutan. Nilai 1 untuk tiap jawaban yang benar. Hentikan setelah 5 jawaban. Atau responden diminta mengeja terbalik kata " W A H Y U " (nilai diberi pada huruf yang benar sebelum kesalahan; misalnya uyahw = 2 nilai)
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">5</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310175]) ? $item[310175] : '-' !!}</td>
                    </tr>
                    <!-- 5 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">5</td>
                        <td style="vertical-align: top;">
                            <div style="font-weight: bold; margin-bottom: 2px;">MENGINGAT KEMBALI (RECALL)</div>
                            Responden diminta menyebut kembali 3 nama benda di atas
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">3</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310176]) ? $item[310176] : '-' !!}</td>
                    </tr>
                    <!-- 6 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">6</td>
                        <td style="vertical-align: top;">
                            <div style="font-weight: bold; margin-bottom: 2px;">BAHASA</div>
                            Responden diminta menyebutkan nama benda yang ditunjukkan (perlihatkan pensil dan jam tangan)
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">2</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310177]) ? $item[310177] : '-' !!}</td>
                    </tr>
                    <!-- 7 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">7</td>
                        <td style="vertical-align: top;">
                            Responden diminta mengulang kalimat : "tanpa kalau dan atau tetapi"
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">1</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310178]) ? $item[310178] : '-' !!}</td>
                    </tr>
                    <!-- 8 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">8</td>
                        <td style="vertical-align: top;">
                            Responden diminta melakukan perintah : "Ambil kertas ini dengan tangan anda, lipat menjadi dua dan letakkan di lantai".
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">3</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310179]) ? $item[310179] : '-' !!}</td>
                    </tr>
                    <!-- 9 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">9</td>
                        <td style="vertical-align: top;">
                            Responden diminta membaca dan melakukan yang dibacanya : "Pejamkanlah mata anda"
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">1</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310180]) ? $item[310180] : '-' !!}</td>
                    </tr>
                    <!-- 10 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">10</td>
                        <td style="vertical-align: top;">
                            Responden diminta menulis sebuah kalimat secara spontan
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">1</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310181]) ? $item[310181] : '-' !!}</td>
                    </tr>
                    <!-- 11 -->
                    <tr>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">11</td>
                        <td style="vertical-align: top; padding-bottom: 8px;">
                            Responden diminta menyalin gambar
                            <div style="margin-top: 5px; text-align: left;">
                                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTUwIDEyMCI+PHBvbHlnb24gcG9pbnRzPSI1MCwxNSA5MCw0NSA3NSw5MCAyNSw5MCAxMCw0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiAvPjxwb2x5Z29uIHBvaW50cz0iODAsMzUgMTIwLDY1IDEwNSwxMTAgNTUsMTEwIDQwLDY1IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIC8+PC9zdmc+" width="150" height="120" style="display: inline-block;">
                            </div>
                        </td>
                        <td class="text-center" style="vertical-align: top; padding-top: 6px;">1</td>
                        <td class="text-center text-bold" style="vertical-align: top; padding-top: 6px;">{!! isset($item[310182]) ? $item[310182] : '-' !!}</td>
                    </tr>
                    <!-- Total Score -->
                    <tr style="font-weight: bold; background-color: #f2f2f2;">
                        <td colspan="2" class="text-right" style="padding: 6px; font-size: 8.5pt;">Skor Total</td>
                        <td class="text-center" style="padding: 6px; font-size: 8.5pt;">30</td>
                        <td class="text-center" style="padding: 6px; font-size: 9pt;">{!! isset($item[310183]) ? $item[310183] : '-' !!}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Tingkat Kesadaran Grid -->
            <div style="font-size: 8.5pt; margin-top: 10px; page-break-inside: avoid;">
                <div style="margin-bottom: 4px;">Tandailah tingkat kesadaran responden pada garis aksis :</div>
                <table style="width: 320px; border-collapse: collapse; text-align: center; font-size: 8.5pt;">
                    <tr>
                        <td style="border: 1px solid #000; height: 20px; width: 80px; vertical-align: middle; text-align: center;">
                            {!! !empty($item[310185]) ? $checkmark : '&nbsp;' !!}
                        </td>
                        <td style="border: 1px solid #000; height: 20px; width: 80px; vertical-align: middle; text-align: center;">
                            {!! !empty($item[310186]) ? $checkmark : '&nbsp;' !!}
                        </td>
                        <td style="border: 1px solid #000; height: 20px; width: 80px; vertical-align: middle; text-align: center;">
                            {!! !empty($item[310187]) ? $checkmark : '&nbsp;' !!}
                        </td>
                        <td style="border: 1px solid #000; height: 20px; width: 80px; vertical-align: middle; text-align: center;">
                            {!! !empty($item[310188]) ? $checkmark : '&nbsp;' !!}
                        </td>
                    </tr>
                    <tr style="font-weight: bold; background-color: #f2f2f2;">
                        <td style="border: 1px solid #000; padding: 3px 0;">Sadar</td>
                        <td style="border: 1px solid #000; padding: 3px 0;">Somnolen</td>
                        <td style="border: 1px solid #000; padding: 3px 0;">Stupor</td>
                        <td style="border: 1px solid #000; padding: 3px 0;">Koma</td>
                    </tr>
                </table>
            </div>

            <!-- Catatan Pemeriksa -->
            <div style="font-size: 8.5pt; margin-top: 10px; page-break-inside: avoid;">
                <div style="font-weight: bold; margin-bottom: 2px;">Catatan pemeriksa :</div>
                <div style="min-height: 40px; border-bottom: 1px dotted #000; padding: 2px 5px; line-height: 1.5; font-style: italic;">
                    {!! !empty($item[310189]) ? nl2br(e($item[310189])) : '&nbsp;' !!}
                </div>
                <div style="border-bottom: 1px dotted #000; height: 18px; margin-top: 5px;"></div>
            </div>
        </div>
        <!-- Section XV: Penilaian Geriatric Depression Scale (GDS) -->
        <div style="page-break-inside: avoid; margin-top: 15px;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XV.</td>
                    <td>Penilaian Geriatric Depression Scale (GDS)</td>
                </tr>
            </table>

            <table class="content-table" style="width: 100%; table-layout: fixed; margin-top: 5px; margin-bottom: 6px;">
                <colgroup>
                    <col style="width: 5%;">
                    <col style="width: 83%;">
                    <col style="width: 6%;">
                    <col style="width: 6%;">
                </colgroup>
                <thead>
                    <tr>
                        <th style="text-align: center;">No</th>
                        <th style="text-align: center;">Pertanyaan</th>
                        <th style="text-align: center;">&nbsp;</th>
                        <th style="text-align: center;">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Row 1 -->
                    <tr>
                        <td class="text-center">1</td>
                        <td>Apakah anda pada dasarnya puas dengan kehidupan anda ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310191]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310192]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 2 -->
                    <tr>
                        <td class="text-center">2</td>
                        <td>Apakah anda sudah meninggalkan banyak kegiatan dan minat/kesenangan anda ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310193]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310194]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 3 -->
                    <tr>
                        <td class="text-center">3</td>
                        <td>Apakah anda merasa kehidupan anda hampa ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310195]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310196]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 4 -->
                    <tr>
                        <td class="text-center">4</td>
                        <td>Apakah anda sering merasa bosan ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310197]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310198]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 5 -->
                    <tr>
                        <td class="text-center">5</td>
                        <td>Apakah anda mempunyai semangat baik setiap saat ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310199]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310200]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 6 -->
                    <tr>
                        <td class="text-center">6</td>
                        <td>Apakah anda takut sesuatu yang buruk akan terjadi pada anda ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310201]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310202]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 7 -->
                    <tr>
                        <td class="text-center">7</td>
                        <td>Apakah anda merasa bahagia pada sebagian besar hidup anda ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310203]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310204]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 8 -->
                    <tr>
                        <td class="text-center">8</td>
                        <td>Apakah anda sering merasa tidak berdaya ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310205]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310206]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 9 -->
                    <tr>
                        <td class="text-center">9</td>
                        <td>Apakah anda kebih senang tinggal di rumah daripada pergi ke luar dan mengerjakan sesuatu hal yang baru ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310207]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310208]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 10 -->
                    <tr>
                        <td class="text-center">10</td>
                        <td>Apakah anda merasa mempunyai banyak masalah dengan daya ingat anda dibandingkan kebanyakan orang ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310209]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310210]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 11 -->
                    <tr>
                        <td class="text-center">11</td>
                        <td>Apakah anda pikir hidup anda sekarang ini menyenangkan ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310211]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310212]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 12 -->
                    <tr>
                        <td class="text-center">12</td>
                        <td>Apakah anda merasa tidak berharga seperti perasaan anda saat kini ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310213]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310214]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 13 -->
                    <tr>
                        <td class="text-center">13</td>
                        <td>Apakah anda merasa penuh semangat ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310215]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310216]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 14 -->
                    <tr>
                        <td class="text-center">14</td>
                        <td>Apakah anda merasa bahwa keadaan anda tidak ada harapan ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310217]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310218]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Row 15 -->
                    <tr>
                        <td class="text-center">15</td>
                        <td>Apakah anda pikir bahwa orang lain lebih baik keadaannya dari anda ?</td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310219]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: bold; vertical-align: middle;">YA</span>
                        </td>
                        <td class="text-center" style="vertical-align: middle; white-space: nowrap; padding: 3px 2px;">
                            <span class="check-box" style="vertical-align: middle; margin-right: 2px;">{!! !empty($item[310220]) ? $checkmark : '&nbsp;' !!}</span><span style="font-weight: normal; vertical-align: middle;">TIDAK</span>
                        </td>
                    </tr>
                    <!-- Total Score Row -->
                    <tr style="font-weight: bold; background-color: #f2f2f2;">
                        <td colspan="3" class="text-center" style="padding: 6px; font-size: 8.5pt;">SKOR TOTAL</td>
                        <td class="text-center" style="padding: 6px; font-size: 9pt;">{!! isset($item[310221]) ? $item[310221] : '-' !!}</td>
                    </tr>
                </tbody>
            </table>




            <div style="font-size: 8pt; font-style: italic; margin-top: 5px;">
                * Lingkari jawaban yang bercetak tebal (bold) setiap jawaban (YA/TIDAK) yang bercetak tebal diberi nilai 1 dan hitung total skor
            </div>
        </div>

        <!-- Section XVI: Pemeriksaan Fisik -->
        <div style="page-break-inside: avoid; margin-top: 15px;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XVI.</td>
                    <td>Pemeriksaan Fisik</td>
                </tr>
            </table>

            <div style="padding-left: 55px; font-size: 8.5pt; margin-top: 5px; line-height: 1.4;">
                <div style="font-weight: bold;">Kesadaran :</div>
                <div style="font-weight: bold; margin-top: 5px;">A. Status Generalis dan Neurologis</div>
                <div style="min-height: 40px; border-bottom: 1px dotted #000; padding: 2px 5px; margin-top: 3px; font-style: italic; margin-bottom: 10px;">
                    {!! !empty($item[310246]) ? nl2br(e($item[310246])) : '&nbsp;' !!}
                </div>

                <div style="font-weight: bold; margin-bottom: 5px; margin-top: 15px;">B. Pemeriksaan Psikiatrik</div>
                <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.5pt;">
                    <tr>
                        <td style="width: 150px; vertical-align: top; padding: 4px 0;">1. Kesan umum</td>
                        <td style="width: 15px; vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0; border-bottom: 1px dotted #000;">
                            {!! isset($item[310248]) ? e($item[310248]) : '&nbsp;' !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">2. Kesadaran</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0;">
                            <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.5pt;">
                                <tr>
                                    <td style="width: 90px; padding: 0;">a. Kuantitatif</td>
                                    <td style="width: 15px; padding: 0;">:</td>
                                    <td style="border-bottom: 1px dotted #000; padding: 0;">{!! isset($item[310250]) ? e($item[310250]) : '&nbsp;' !!}</td>
                                    <td style="width: 30px; padding: 0;">&nbsp;</td>
                                    <td style="width: 90px; padding: 0;">b. Kualitatif</td>
                                    <td style="width: 15px; padding: 0;">:</td>
                                    <td style="border-bottom: 1px dotted #000; padding: 0;">{!! isset($item[310251]) ? e($item[310251]) : '&nbsp;' !!}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">3. Orientasi</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0;">
                            <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.5pt;">
                                <tr>
                                    <td style="width: 45px; padding: 0;">Waktu</td>
                                    <td style="width: 10px; padding: 0;">:</td>
                                    <td style="border-bottom: 1px dotted #000; padding: 0;">{!! isset($item[310253]) ? e($item[310253]) : '&nbsp;' !!}</td>
                                    <td style="width: 15px; padding: 0;">&nbsp;</td>
                                    <td style="width: 45px; padding: 0;">Tempat</td>
                                    <td style="width: 10px; padding: 0;">:</td>
                                    <td style="border-bottom: 1px dotted #000; padding: 0;">{!! isset($item[310254]) ? e($item[310254]) : '&nbsp;' !!}</td>
                                    <td style="width: 15px; padding: 0;">&nbsp;</td>
                                    <td style="width: 45px; padding: 0;">Orang</td>
                                    <td style="width: 10px; padding: 0;">:</td>
                                    <td style="border-bottom: 1px dotted #000; padding: 0;">{!! isset($item[310255]) ? e($item[310255]) : '&nbsp;' !!}</td>
                                    <td style="width: 15px; padding: 0;">&nbsp;</td>
                                    <td style="width: 45px; padding: 0;">Situasi</td>
                                    <td style="width: 10px; padding: 0;">:</td>
                                    <td style="border-bottom: 1px dotted #000; padding: 0;">{!! isset($item[310256]) ? e($item[310256]) : '&nbsp;' !!}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">4. Sikap dan tingkah laku</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0; border-bottom: 1px dotted #000;">
                            {!! isset($item[310257]) ? e($item[310257]) : '&nbsp;' !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">5. Proses pikir</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0;">
                            <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.5pt;">
                                <tr>
                                    <td style="width: 110px; padding: 2px 0; vertical-align: top;">a. Bentuk pikir</td>
                                    <td style="width: 15px; padding: 2px 0; vertical-align: top;">:</td>
                                    <td style="border-bottom: 1px dotted #000; padding: 2px 0; vertical-align: top;">{!! isset($item[310259]) ? e($item[310259]) : '&nbsp;' !!}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px 0; vertical-align: top;">b. Isi pikir</td>
                                    <td style="padding: 2px 0; vertical-align: top;">:</td>
                                    <td style="border-bottom: 1px dotted #000; padding: 2px 0; vertical-align: top;">{!! isset($item[310260]) ? e($item[310260]) : '&nbsp;' !!}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 2px 0; vertical-align: top;">c. Progresi pikir</td>
                                    <td style="padding: 2px 0; vertical-align: top;">:</td>
                                    <td style="padding: 2px 0; vertical-align: top;">
                                        <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.5pt;">
                                            <tr>
                                                <td style="width: 90px; padding: 0;">- Kuantitatif</td>
                                                <td style="width: 15px; padding: 0;">:</td>
                                                <td style="border-bottom: 1px dotted #000; padding: 0;">{!! isset($item[310262]) ? e($item[310262]) : '&nbsp;' !!}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 2px 0 0 0;">- Kualitatif</td>
                                                <td style="padding: 2px 0 0 0;">:</td>
                                                <td style="border-bottom: 1px dotted #000; padding: 2px 0 0 0;">{!! isset($item[310263]) ? e($item[310263]) : '&nbsp;' !!}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">6. Mood</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0; border-bottom: 1px dotted #000;">
                            {!! isset($item[310264]) ? e($item[310264]) : '&nbsp;' !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">7. Afek</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0; border-bottom: 1px dotted #000;">
                            {!! isset($item[310265]) ? e($item[310265]) : '&nbsp;' !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">8. Gangguan persepsi</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0; border-bottom: 1px dotted #000;">
                            {!! isset($item[310266]) ? e($item[310266]) : '&nbsp;' !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">9. Gangguan memori</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0; border-bottom: 1px dotted #000;">
                            {!! isset($item[310267]) ? e($item[310267]) : '&nbsp;' !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">10. Gangguan Intelegensi</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0; border-bottom: 1px dotted #000;">
                            {!! isset($item[310268]) ? e($item[310268]) : '&nbsp;' !!}
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">11. Perhatian</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0;">
                            <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.5pt;">
                                <tr>
                                    <td style="border-bottom: 1px dotted #000; padding: 0;">{!! isset($item[310269]) ? e($item[310269]) : '&nbsp;' !!}</td>
                                    <td style="width: 25px; padding: 0;">&nbsp;</td>
                                    <td style="width: 220px; padding: 0; text-align: right; font-weight: normal;">Hubungan jiwa : sukar / mudah</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top; padding: 4px 0;">12. Insight</td>
                        <td style="vertical-align: top; padding: 4px 0;">:</td>
                        <td style="vertical-align: top; padding: 4px 0; border-bottom: 1px dotted #000;">
                            {!! isset($item[310270]) ? e($item[310270]) : '&nbsp;' !!}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Section XVII: Pemeriksaan Penunjang -->
        <div style="page-break-inside: avoid; margin-top: 15px;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XVII.</td>
                    <td>Pemeriksaan Penunjang</td>
                </tr>
            </table>
            <div style="padding-left: 55px; min-height: 50px; font-size: 8.5pt; border-bottom: 1px dotted #000; padding-bottom: 5px; margin-top: 5px; font-style: italic;">
                {!! !empty($item[310272]) ? nl2br(e($item[310272])) : '&nbsp;' !!}
            </div>
        </div>

        <!-- Section XVIII: Diagnosis -->
        <div style="page-break-inside: avoid; margin-top: 15px;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XVIII.</td>
                    <td>Diagnosis</td>
                </tr>
            </table>
            <div style="padding-left: 55px; min-height: 50px; font-size: 8.5pt; border-bottom: 1px dotted #000; padding-bottom: 5px; margin-top: 5px; font-style: italic;">
                {!! !empty($item[310273]) ? nl2br(e($item[310273])) : '&nbsp;' !!}
            </div>
        </div>

        <!-- Section XIX: Masalah Keperawatan -->
        <div style="page-break-inside: avoid; margin-top: 15px;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XIX.</td>
                    <td>Masalah Keperawatan</td>
                </tr>
            </table>
            <div style="padding-left: 55px; min-height: 50px; font-size: 8.5pt; border-bottom: 1px dotted #000; padding-bottom: 5px; margin-top: 5px; font-style: italic;">
                {!! !empty($item[310274]) ? nl2br(e($item[310274])) : '&nbsp;' !!}
            </div>
        </div>

        <!-- Section XX: Penatalaksanaan -->
        <div style="page-break-inside: avoid; margin-top: 15px;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XX.</td>
                    <td>Penatalaksanaan</td>
                </tr>
            </table>
            <div style="padding-left: 55px; margin-top: 5px;">
                <table class="content-table" style="width: 100%; table-layout: fixed;">
                    <thead>
                        <tr>
                            <th style="width: 50%; text-align: center; font-weight: bold; background-color: #f2f2f2; padding: 4px;">Medis</th>
                            <th style="width: 50%; text-align: center; font-weight: bold; background-color: #f2f2f2; padding: 4px;">Keperawatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="vertical-align: top; padding: 6px; font-size: 8.5pt; font-style: italic; line-height: 1.5; word-wrap: break-word; white-space: pre-wrap;">
                                <div style="min-height: 150px;">
                                    {!! !empty($item[310276]) ? nl2br(e($item[310276])) : '&nbsp;' !!}
                                </div>
                            </td>
                            <td style="vertical-align: top; padding: 6px; font-size: 8.5pt; font-style: italic; line-height: 1.5; word-wrap: break-word; white-space: pre-wrap;">
                                <div style="min-height: 150px;">
                                    {!! !empty($item[310277]) ? nl2br(e($item[310277])) : '&nbsp;' !!}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Section XXI: Integrasi Asuhan -->
        <div style="page-break-inside: avoid; margin-top: 15px; font-size: 8.5pt; line-height: 1.4;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-bottom: 5px;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XXI.</td>
                    <td>Integrasi Asuhan</td>
                </tr>
            </table>

            <div style="padding-left: 55px;">
                <div style="margin-bottom: 5px;">
                    <span class="check-box">{!! !empty($item[310279]) ? $checkmark : '&nbsp;' !!}</span>
                    <span style="font-weight: bold;">Dokter :</span>
                    {!! isset($item[310280]) && trim($item[310280]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($item[310280]) . '</span>' : '..................................................' !!}
                </div>
                <div style="margin-bottom: 5px;">
                    <span class="check-box">{!! !empty($item[310281]) ? $checkmark : '&nbsp;' !!}</span>
                    <span style="font-weight: bold;">Perawat :</span>
                    {!! isset($item[310282]) && trim($item[310282]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($item[310282]) . '</span>' : '..................................................' !!}
                </div>
                <div style="margin-bottom: 8px;">
                    <span class="check-box">{!! !empty($item[310283]) ? $checkmark : '&nbsp;' !!}</span>
                    <span style="font-weight: bold;">PPA Lain :</span>
                    {!! isset($item[310284]) && trim($item[310284]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($item[310284]) . '</span>' : '..................................................' !!}
                </div>

                <div style="font-weight: bold; margin-top: 10px;">Catatan / Notasi DPJP :</div>
                <div style="min-height: 40px; border-bottom: 1px dotted #000; padding: 2px 5px; margin-top: 3px; font-style: italic;">
                    {!! !empty($item[310285]) ? nl2br(e($item[310285])) : '&nbsp;' !!}
                </div>

                @php
                $foundKeluar = '';
                $foundPasien = false;
                $foundKeluarga = false;
                $foundKeluargaNama = '';
                $foundLain = false;
                $foundLainKet = '';
                foreach ($res['d'] as $items) {
                    if (($items->emrdfk == 1901310174 || $items->emrdfk == 300000082) && !empty($items->value)) {
                        $foundKeluar = $items->value;
                    }
                    if ($items->emrdfk == 300000067 && ($items->value == '1' || $items->value == 'true' || $items->value == 't')) {
                        $foundPasien = true;
                    }
                    if ($items->emrdfk == 300000068 && ($items->value == '1' || $items->value == 'true' || $items->value == 't')) {
                        $foundKeluarga = true;
                    }
                    if ($items->emrdfk == 1901300427 && !empty($items->value)) {
                        $foundKeluargaNama = $items->value;
                    }
                    if ($items->emrdfk == 300000069 && ($items->value == '1' || $items->value == 'true' || $items->value == 't')) {
                        $foundLain = true;
                    }
                    if ($items->emrdfk == 1901300428 && !empty($items->value)) {
                        $foundLainKet = $items->value;
                    }
                }
                @endphp

                <div style="margin-top: 12px;">
                    <span style="font-weight: bold;">Keadaan Waktu Keluar :</span>
                    {!! !empty($foundKeluar) && trim($foundKeluar) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($foundKeluar) . '</span>' : '..................................................' !!}
                </div>

                <div style="margin-top: 12px; line-height: 1.5;">
                    <div>Penjelasan hasil pengkajian, pemeriksaan fisik dan penunjang, diagnosis, rencana asuhan dan terapi, dijelaskan kepada :</div>
                    <div style="margin-top: 3px;">
                        <span class="check-box">{!! $foundPasien ? $checkmark : '&nbsp;' !!}</span> Pasien
                    </div>
                    <div style="margin-top: 3px;">
                        <span class="check-box">{!! $foundKeluarga ? $checkmark : '&nbsp;' !!}</span> Keluarga pasien, nama
                        {!! !empty($foundKeluargaNama) && trim($foundKeluargaNama) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($foundKeluargaNama) . '</span>' : '..................................................' !!}
                        hubungan dengan pasien
                        <span style="border-bottom: 1px dotted #000; display: inline-block; min-width: 150px; font-style: italic;">&nbsp;</span>
                    </div>
                    <div style="margin-top: 3px;">
                        <span class="check-box">{!! $foundLain ? $checkmark : '&nbsp;' !!}</span> Lain-lain
                        {!! !empty($foundLainKet) && trim($foundLainKet) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($foundLainKet) . '</span>' : '........................................................................................' !!}
                    </div>
                </div>
            </div>
        </div>

        <!-- Section XXII: Rencana Pemulangan Pasien -->
        <div style="page-break-inside: avoid; margin-top: 15px; font-size: 8.5pt; line-height: 1.4;">
            <table style="width: 100%; font-size: 8.5pt; font-weight: bold; margin-bottom: 5px;">
                <tr>
                    <td style="width: 35px; padding-left: 20px;">XXII.</td>
                    <td>Rencana Pemulangan Pasien</td>
                </tr>
            </table>

            <div style="padding-left: 55px; margin-top: 5px;">
                <table style="width: 100%; border-collapse: collapse; border: none; font-size: 8.5pt; line-height: 1.6;">
                    <!-- Row 1: Pulang, Konsultasi Selesai -->
                    <tr>
                        <td style="vertical-align: top; padding: 3px 0;">
                            <span class="check-box">{!! !empty($item[310287]) ? $checkmark : '&nbsp;' !!}</span>
                            <span>Pulang, Konsultasi Selesai :</span>
                            {!! isset($item[310288]) && trim($item[310288]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($item[310288]) . '</span>' : '..................................................' !!}
                        </td>
                    </tr>
                    <!-- Row 2: Pulang, Kontrol Ulang -->
                    <tr>
                        <td style="vertical-align: top; padding: 3px 0;">
                            <span class="check-box">{!! !empty($item[310289]) ? $checkmark : '&nbsp;' !!}</span>
                            <span>Pulang, Kontrol Ulang :</span>
                            {!! isset($item[310290]) && trim($item[310290]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 15px; font-style: italic;">' . e($item[310290]) . '</span>' : '...........' !!}
                            <span>hari</span>
                        </td>
                    </tr>
                    <!-- Row 3: Rujuk ke -->
                    <tr>
                        <td style="vertical-align: top; padding: 3px 0;">
                            <span class="check-box">{!! !empty($item[310291]) ? $checkmark : '&nbsp;' !!}</span>
                            <span>Rujuk ke :</span>
                            {!! isset($item[310292]) && trim($item[310292]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($item[310292]) . '</span>' : '........................................................................................' !!}
                        </td>
                    </tr>
                    <!-- Row 4: Lain-lain -->
                    <tr>
                        <td style="vertical-align: top; padding: 3px 0;">
                            <span class="check-box">{!! !empty($item[310293]) ? $checkmark : '&nbsp;' !!}</span>
                            {!! isset($item[310294]) && trim($item[310294]) !== '' ? '<span style="border-bottom: 1px dotted #000; padding: 0 10px; font-style: italic;">' . e($item[310294]) . '</span>' : '............................................................................................................' !!}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Signatures Block -->
        @php
        $selesaiTgl = '';
        $selesaiJam = '';
        foreach ($res['d'] as $items) {
            if ($items->emrdfk == 310297 && !empty($items->value)) {
                $indonesianMonths = [
                    1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April', 5 => 'Mei', 6 => 'Juni',
                    7 => 'Juli', 8 => 'Agustus', 9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
                ];
                $selesaiJam = date('H:i', strtotime($items->value));
                $day = (int)date('d', strtotime($items->value));
                $monthNum = (int)date('m', strtotime($items->value));
                $year = date('Y', strtotime($items->value));
                $monthName = isset($indonesianMonths[$monthNum]) ? $indonesianMonths[$monthNum] : '';
                $selesaiTgl = "$day $monthName $year";
                break;
            }
        }
        @endphp
        <div style="page-break-inside: avoid; margin-top: 30px;">
            <div style="text-align: right; margin-right: 30px; margin-bottom: 15px; font-size: 8.5pt;">
                Selesai pemeriksaan, Tanggal <u>&nbsp;&nbsp;{!! !empty($selesaiTgl) ? $selesaiTgl : '___________' !!}&nbsp;&nbsp;</u> Pukul <u>&nbsp;&nbsp;{!! !empty($selesaiJam) ? $selesaiJam : '_____' !!}&nbsp;&nbsp;</u>
            </div>
            <table class="signature-table" style="width: 100%; border-collapse: collapse; border: none; font-size: 8.5pt;">
                <tr>
                    <td style="width: 33%; text-align: center; vertical-align: top; border: none;">
                        Perawat,<br><br><br><br><br>
                        <b>( {!! isset($item[310286]) ? $item[310286] : '.........................................' !!} )</b>
                    </td>
                    <td style="width: 33%; text-align: center; vertical-align: top; border: none;">
                        Dokter Pemeriksa/DPJP,<br><br><br><br><br>
                        <b>( {!! isset($item[310296]) ? $item[310296] : '.........................................' !!} )</b>
                    </td>
                    <td style="width: 34%; text-align: center; vertical-align: top; border: none;">
                        Penanggung Jawab Pasien,<br><br><br><br><br>
                        <b>( {!! isset($item[310295]) ? $item[310295] : '.........................................' !!} )</b>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
