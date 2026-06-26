<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    @else
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('service/css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/tabel.css') }}">
    @endif

    <title>Formulir Manajer Pelayanan Pasien (MPP)</title>
    <style>
        @page {
            size: A4;
            margin: 5mm;
        }

        @media print {
            tr {
                page-break-inside: avoid;
            }
            td {
                page-break-inside: avoid;
            }
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 9pt;
            color: #000;
            line-height: 1.3;
        }

        .box {
            border: 1.5px solid black;
            padding: 5px;
        }

        .bold {
            font-weight: bold;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-top {
            vertical-align: top;
        }

        .text-middle {
            vertical-align: middle;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .table-bordered th,
        .table-bordered td {
            border: 1px solid #000;
            padding: 4px;
        }

        .table-bordered td.no-padding {
            padding: 0 !important;
        }

        .mpp-section-header {
            background-color: #e6e6e6;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding: 4px 6px;
            margin: 0;
            display: block;
        }

        .table-bordered th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }

        .checkbox-box {
            display: inline-block;
            width: 10px;
            height: 10px;
            border: 1px solid #000;
            margin-right: 4px;
            vertical-align: middle;
            text-align: center;
            line-height: 9px;
            font-size: 8px;
            background-color: #fff;
        }

        .checkbox-checked:after {
            content: "✓";
            font-weight: bold;
        }

        .grid-2 {
            width: 100%;
        }

        .grid-2 td {
            width: 50%;
            border: none !important;
            padding: 2px 4px !important;
        }

        .grid-3 td {
            width: 33.33%;
            border: none !important;
            padding: 2px 4px !important;
        }

        .grid-4 td {
            width: 25%;
            border: none !important;
            padding: 2px 4px !important;
        }

        .section-title {
            font-weight: bold;
            background-color: #e6e6e6;
            padding: 3px 5px;
            margin-bottom: 5px;
            border: 1px solid #000;
        }

        .signature-area {
            text-align: center;
            padding-top: 40px;
            font-size: 8.5pt;
        }

        .signature-space {
            height: 50px;
        }

        .sub-section {
            margin-bottom: 8px;
        }

        .sub-title {
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 2px;
        }
    </style>
</head>

<body class="A4" onLoad="window.print()">
    @php
        $item = [];
        foreach ($detail as $d) {
            if ($d['value'] !== null && $d['value'] !== '') {
                $item[$d['id']] = $d['value'];
            }
        }

        if (!function_exists('formatCombo')) {
            function formatCombo($val) {
                if (strpos($val, '~') !== false) {
                    return explode('~', $val)[1];
                }
                return $val;
            }
        }

        if (!function_exists('isChecked')) {
            function isChecked($item, $id) {
                return isset($item[$id]) && ($item[$id] == '1' || $item[$id] == 'true' || $item[$id] === true);
            }
        }

        $logoDiyPath = (stripos(\Request::url(), 'localhost') !== FALSE) ? asset('img/diy.png') : asset('service/img/diy.png');
        $logoGrhasiaPath = (stripos(\Request::url(), 'localhost') !== FALSE) ? asset('img/logo_grhasia_full.png') : asset('service/img/logo_grhasia_full.png');
        $aksaraPath = (stripos(\Request::url(), 'localhost') !== FALSE) ? asset('img/aksara_jawa-com.png') : asset('service/img/aksara_jawa-com.png');
    @endphp

    <section class="sheet" style="padding: 5mm;">
        <!-- Header -->
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <!-- Left: DIY Logo -->
                    <td style="text-align: center; vertical-align: middle;" width="11%">
                        <img src="{{ $logoDiyPath }}" alt="Logo DIY" style="width: 70px; margin: 0 !important; padding: 0 !important;">
                    </td>
                    <!-- Center: Dinas & RSJ Text + Aksara Jawa -->
                    <td style="text-align: center; vertical-align: top;" width="39%">
                        <b style="font-family: Arial, sans-serif;">
                            <span style="font-size: 9.5pt;">{!! $profile ? $profile->baris1 : 'PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA' !!}</span>
                            <br>
                            <span style="font-size: 11.5pt;">{!! $profile ? $profile->baris2 : 'DINAS KESEHATAN' !!}</span>
                            <br>
                            <span style="font-size: 11.5pt;">{!! $profile ? strtoupper($profile->namalengkap) : 'RUMAH SAKIT JIWA GRHASIA' !!}</span>
                            <br>
                            <img src="{{ $aksaraPath }}" alt="Aksara Jawa" style="width: 130px; margin: 2px 0;">
                        </b>
                    </td>
                    <!-- Middle-Right: Grhasia Logo -->
                    <td style="text-align: center; vertical-align: middle;" width="15%">
                        <img src="{{ $logoGrhasiaPath }}" alt="Logo Grhasia" style="width: 140px; margin: 0 !important; padding: 0 !important;">
                    </td>
                    <!-- Right: Patient Box -->
                    <td width="35%" class="text-top" style="padding-left: 5px;">
                        <div class="box" style="text-align: left; font-size: 8pt; border: 1.5px solid #000; padding: 4px;">
                            <table style="width: 100%; border: none;">
                                <tr style="border: none;">
                                    <td style="border: none; padding: 2px 0; width: 28%; font-family: Arial; font-size: 7.5pt; vertical-align: middle;">Nomor RM</td>
                                    <td style="border: none; padding: 2px 0; width: 72%; vertical-align: middle;">
                                        @php
                                            $rmVal = $pasien ? $pasien->nocm : '';
                                            $rmClean = str_replace('-', '', $rmVal);
                                            $digits = str_split($rmClean);
                                            while(count($digits) < 6) {
                                                array_unshift($digits, '');
                                            }
                                        @endphp
                                        @foreach(array_slice($digits, 0, 6) as $index => $digit)
                                            <span style="display: inline-block; width: 13px; height: 13px; border: 1px solid #000; text-align: center; line-height: 12px; font-weight: bold; font-family: Arial; font-size: 8.5pt; margin-right: 1px;">{{ $digit }}</span>
                                            @if($index == 1 || $index == 3)
                                                <span style="font-weight: bold; font-size: 8.5pt; font-family: Arial;">-</span>
                                            @endif
                                        @endforeach
                                    </td>
                                </tr>
                                <tr style="border: none;">
                                    <td style="border: none; padding: 2px 0; font-family: Arial; font-size: 7.5pt; vertical-align: top;">Nama Pasien</td>
                                    <td style="border: none; padding: 2px 0; font-family: Arial; font-size: 7.5pt; font-weight: bold; vertical-align: top;">: {!! $pasien ? $pasien->namapasien : '' !!}</td>
                                </tr>
                                <tr style="border: none;">
                                    <td style="border: none; padding: 2px 0; font-family: Arial; font-size: 7.5pt; vertical-align: top;">Tanggal lahir</td>
                                    <td style="border: none; padding: 2px 0; font-family: Arial; font-size: 7.5pt; vertical-align: top;">: {!! $pasien ? date('d-m-Y', strtotime($pasien->tgllahir)) : '' !!}</td>
                                </tr>
                                <tr style="border: none;">
                                    <td style="border: none; padding: 2px 0; font-family: Arial; font-size: 7.5pt; vertical-align: top;">Jenis Kelamin</td>
                                    <td style="border: none; padding: 2px 0; font-family: Arial; font-size: 7.5pt; vertical-align: top;">: 
                                        @if($pasien)
                                            @if($pasien->jeniskelamin == 'Laki-laki')
                                                Laki-laki
                                            @elseif($pasien->jeniskelamin == 'Perempuan')
                                                Perempuan
                                            @else
                                                Laki-laki / Perempuan
                                            @endif
                                        @else
                                            Laki-laki / Perempuan
                                        @endif
                                    </td>
                                </tr>
                            </table>
                            <div style="font-size: 5.5pt; font-family: Arial; font-style: italic; margin-top: 3px; border-top: 0.5px solid #000; padding-top: 2px; line-height: 1.1;">
                                (Mohon diisi huruf kapital atau tempelkan stiker jika ada)
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Address & Thick Line -->
        <div style="text-align: center; font-size: 7pt; font-family: Arial; margin-top: 3px; line-height: 1.2;">
            Jalan Kaliurang KM 17 Sleman, Kode Pos 55582, Telepon: (0274) 895143, 895297<br>
            Faksimile: (0274) 895142, Pos-el: <a href="mailto:grhasiamentalhospital@jogjaprov.go.id" style="color: blue; text-decoration: underline;">grhasiamentalhospital@jogjaprov.go.id</a><br>
            Laman: <a href="http://grhasia.jogjaprov.go.id" style="color: blue; text-decoration: underline;">grhasia.jogjaprov.go.id</a>
        </div>
        <hr style="border: none; border-top: 3px solid #000; margin: 3px 0 8px 0;">

        <!-- Title -->
        <div class="text-center bold" style="font-size: 11pt; margin-bottom: 10px; text-decoration: underline;">
            FORMULIR MANAJER PELAYANAN PASIEN (MPP)
        </div>

        <!-- Initial Information -->
        <table class="table-bordered" style="margin-bottom: 10px;">
            <tr>
                <td width="15%" class="bold">Tanggal MRS :</td>
                <td width="35%">{{ $item[1901310064] ?? '-' }}</td>
                <td width="15%" class="bold">Wisma / Ruang :</td>
                <td width="35%">{{ $item[1901310065] ?? '-' }}</td>
            </tr>
            <tr>
                <td class="bold text-top">Diagnosa Medis :</td>
                <td class="text-top">{{ $item[1901310066] ?? '-' }}</td>
                <td class="bold text-top">Nama DPJP :</td>
                <td class="text-top">{{ isset($item[1901310067]) ? formatCombo($item[1901310067]) : '-' }}</td>
            </tr>
        </table>

        <!-- Main EMR Content Table -->
        <table class="table-bordered" style="margin-bottom: 10px;">
            <thead>
                <tr>
                    <th width="15%">TANGGAL / JAM</th>
                    <th width="65%">CATATAN MANAJER PELAYANAN PASIEN (MPP)</th>
                    <th width="20%">NAMA DAN TANDA TANGAN</th>
                </tr>
            </thead>
            <tbody>
                <!-- A. Identifikasi Skrining Pasien -->
                <tr>
                    <td class="text-center text-top" style="padding-top: 10px;">
                        <span class="bold">{{ $item[1901310068] ?? '-' }}</span>
                    </td>
                    <td class="text-top no-padding">
                        <div class="mpp-section-header">A. Identifikasi / Skrining Pasien</div>
                        <div style="padding: 6px;">
                            <div class="bold" style="margin-bottom: 3px;">1. Risiko Tinggi:</div>
                            <table class="grid-3" style="margin-bottom: 6px;">
                                <tr>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310071) ? 'checkbox-checked' : '' }}"></span> Kematian</td>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310072) ? 'checkbox-checked' : '' }}"></span> Lari</td>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310073) ? 'checkbox-checked' : '' }}"></span> Bunuh diri</td>
                                </tr>
                                <tr>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310074) ? 'checkbox-checked' : '' }}"></span> Kekerasan Seksual</td>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310075) ? 'checkbox-checked' : '' }}"></span> Readmisi</td>
                                    <td></td>
                                </tr>
                            </table>

                            <div class="bold" style="margin-bottom: 3px;">2. Risiko Masalah Pembiayaan:</div>
                            <table class="grid-3" style="margin-bottom: 6px;">
                                <tr>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310077) ? 'checkbox-checked' : '' }}"></span> Tanpa Jaminan</td>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310078) ? 'checkbox-checked' : '' }}"></span> Pembayaran belum jelas</td>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310079) ? 'checkbox-checked' : '' }}"></span> Minimal coverage</td>
                                </tr>
                            </table>

                            <div class="bold" style="margin-bottom: 3px;">3. Kasus Kompleks:</div>
                            <table class="grid-2" style="margin-bottom: 6px;">
                                <tr>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310081) ? 'checkbox-checked' : '' }}"></span> Multidiagnosis</td>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310082) ? 'checkbox-checked' : '' }}"></span> Multiprovider (pasien dengan &ge; 3 DPJP)</td>
                                </tr>
                            </table>

                            <div style="margin-bottom: 6px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310083) ? 'checkbox-checked' : '' }}"></span>
                                <span class="bold">4. Rawat Inap melebihi LOS (Length of Stay) &ge; 28 hari</span>
                            </div>

                            <div class="bold" style="margin-bottom: 3px;">5. Risiko Masalah Psikososial:</div>
                            <table class="grid-2" style="margin-bottom: 6px;">
                                <tr>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310085) ? 'checkbox-checked' : '' }}"></span> Tanpa Identitas</td>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310086) ? 'checkbox-checked' : '' }}"></span> Riwayat Dropping</td>
                                </tr>
                                <tr>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310087) ? 'checkbox-checked' : '' }}"></span> Riwayat dan Risiko Penelantaran</td>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310088) ? 'checkbox-checked' : '' }}"></span> Riwayat Pasung</td>
                                </tr>
                                <tr>
                                    <td><span class="checkbox-box {{ isChecked($item, 1901310089) ? 'checkbox-checked' : '' }}"></span> Kurang support keluarga</td>
                                    <td></td>
                                </tr>
                            </table>

                            <div style="margin-bottom: 6px;">
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="width: 50%; padding: 0; border: none;">
                                            <span class="checkbox-box {{ isChecked($item, 1901310090) ? 'checkbox-checked' : '' }}"></span>
                                            <span class="bold">6. Risiko Komplain</span>
                                        </td>
                                        <td style="width: 50%; padding: 0; border: none;">
                                            <span class="checkbox-box {{ isChecked($item, 1901310091) ? 'checkbox-checked' : '' }}"></span>
                                            <span class="bold">7. Berpotensi Kasus Hukum</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0; border: none; padding-top: 4px;">
                                            <span class="checkbox-box {{ isChecked($item, 1901310092) ? 'checkbox-checked' : '' }}"></span>
                                            <span class="bold">8. Pasien dirawat di Ruang Intensif > 5 hari</span>
                                        </td>
                                        <td style="padding: 0; border: none; padding-top: 4px;">
                                            <span class="checkbox-box {{ isChecked($item, 1901310093) ? 'checkbox-checked' : '' }}"></span>
                                            <span class="bold">9. ADL Fungsional rendah, bantuan tinggi</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310094) ? 'checkbox-checked' : '' }}"></span>
                                <span class="bold">10. Kasus Penyakit Kronis, Katastropik, Terminal:</span>
                                <span style="border-bottom: 1px dotted #000; padding-left: 5px; display: inline-block; width: 40%;">
                                    {{ $item[1901310096] ?? '' }}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td class="text-top">
                        <div class="signature-area">
                            <div>Petugas Skrining,</div>
                            <div class="signature-space"></div>
                            <div class="bold">{{ isset($item[1901310097]) ? formatCombo($item[1901310097]) : '.....................................' }}</div>
                        </div>
                    </td>
                </tr>

                <!-- B. Asesmen Awal MPP -->
                <tr>
                    <td class="text-center text-top" style="padding-top: 10px;">
                        <span class="bold">{{ $item[1901310098] ?? '-' }}</span>
                    </td>
                    <td class="text-top no-padding">
                        <div class="mpp-section-header">B. Asesmen Awal</div>
                        <div style="padding: 6px; white-space: pre-line;">
                            {!! isset($item[1901310099]) ? e($item[1901310099]) : '<i>Tidak ada catatan asesmen awal.</i>' !!}
                        </div>
                    </td>
                    <td class="text-top">
                        <div class="signature-area">
                            <div>Manajer Pelayanan Pasien,</div>
                            <div class="signature-space"></div>
                            <div class="bold">{{ isset($item[1901310100]) ? formatCombo($item[1901310100]) : '.....................................' }}</div>
                        </div>
                    </td>
                </tr>

                <!-- C. Asesmen Manajemen Pelayanan Pasien -->
                <tr>
                    <td class="text-center text-top" style="padding-top: 10px;">
                        <span class="bold">{{ $item[1901310101] ?? '-' }}</span>
                    </td>
                    <td class="text-top no-padding">
                        <div class="mpp-section-header">C. Asesmen Manajemen Pelayanan Pasien</div>
                        <div style="padding: 6px; white-space: pre-line;">
                            {!! isset($item[1901310118]) ? e($item[1901310118]) : '<i>Tidak ada catatan asesmen manajemen pelayanan.</i>' !!}
                        </div>
                    </td>
                    <td class="text-top">
                        <div class="signature-area">
                            <div>Manajer Pelayanan Pasien,</div>
                            <div class="signature-space"></div>
                            <div class="bold">{{ isset($item[1901310116]) ? formatCombo($item[1901310116]) : '.....................................' }}</div>
                        </div>
                    </td>
                </tr>

                <!-- D. Identifikasi Masalah & Kesempatan -->
                <tr>
                    <td class="text-center text-top" style="padding-top: 10px;">
                        <span class="bold">{{ $item[1901310117] ?? '-' }}</span>
                    </td>
                    <td class="text-top no-padding">
                        <div class="mpp-section-header">D. Identifikasi Masalah dan Kesempatan</div>
                        <div style="padding: 6px;">
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310103) ? 'checkbox-checked' : '' }}"></span> Asuhan pelayanan yang tidak sesuai kebutuhan
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310104) ? 'checkbox-checked' : '' }}"></span> Over/under utilisasi pelayanan sesuai standar yang digunakan
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310105) ? 'checkbox-checked' : '' }}"></span> Ketidak patuhan pasien
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310106) ? 'checkbox-checked' : '' }}"></span> Kurang pengetahuan keluarga terhadap penyakit
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310107) ? 'checkbox-checked' : '' }}"></span> Kurang dukungan keluarga
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310108) ? 'checkbox-checked' : '' }}"></span> Penurunan determinasi pasien (tingkat keparahan/komplikasi meningkat) sehubungan penyakit yang diderita
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310109) ? 'checkbox-checked' : '' }}"></span> Kendala keuangan
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310110) ? 'checkbox-checked' : '' }}"></span> Masalah rujukan yang tertunda
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310111) ? 'checkbox-checked' : '' }}"></span> Masalah pemulangan pasien yang tertunda
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310112) ? 'checkbox-checked' : '' }}"></span> Masalah ketergantungan ADL (Activity Daily Living)
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310113) ? 'checkbox-checked' : '' }}"></span> Kondisi pasien belum memenuhi kriteria untuk dirawat di Ruang Maintenance
                            </div>
                            <div style="margin-bottom: 4px;">
                                <span class="checkbox-box {{ isChecked($item, 1901310114) ? 'checkbox-checked' : '' }}"></span> Lain-lain:
                                <span style="border-bottom: 1px dotted #000; padding-left: 5px; display: inline-block; width: 60%;">
                                    {{ $item[1901310115] ?? '' }}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td class="text-top">
                        <div class="signature-area">
                            <div>Manajer Pelayanan Pasien,</div>
                            <div class="signature-space"></div>
                            <div class="bold">{{ isset($item[1901310102]) ? formatCombo($item[1901310102]) : '.....................................' }}</div>
                        </div>
                    </td>
                </tr>

                <!-- E. Perencanaan MPP -->
                <tr>
                    <td class="text-center text-top" style="padding-top: 10px;">
                        <span class="bold">{{ $item[1901310119] ?? '-' }}</span>
                    </td>
                    <td class="text-top no-padding">
                        <div class="mpp-section-header">E. Perencanaan Manajemen Pelayanan Pasien</div>
                        <div style="padding: 6px;">
                            <div class="sub-section">
                                <div class="sub-title">Utilisasi / Mutu asuhan:</div>
                                <div style="white-space: pre-line;">{!! isset($item[1901310120]) ? e($item[1901310120]) : '-' !!}</div>
                            </div>
                            <div class="sub-section">
                                <div class="sub-title">Koordinasi:</div>
                                <div style="white-space: pre-line;">{!! isset($item[1901310141]) ? e($item[1901310141]) : '-' !!}</div>
                            </div>
                            <div class="sub-section">
                                <div class="sub-title">Kolaborasi:</div>
                                <div style="white-space: pre-line;">{!! isset($item[1901310144]) ? e($item[1901310144]) : '-' !!}</div>
                            </div>
                            <div class="sub-section">
                                <div class="sub-title">Advokasi:</div>
                                <div style="white-space: pre-line;">{!! isset($item[1901310147]) ? e($item[1901310147]) : '-' !!}</div>
                            </div>
                            <div class="sub-section">
                                <div class="sub-title">Edukasi:</div>
                                <div style="white-space: pre-line;">{!! isset($item[1901310138]) ? e($item[1901310138]) : '-' !!}</div>
                            </div>
                        </div>
                    </td>
                    <td class="text-top">
                        <div class="signature-area">
                            <div>Manajer Pelayanan Pasien,</div>
                            <div class="signature-space"></div>
                            <div class="bold">{{ isset($item[1901310130]) ? formatCombo($item[1901310130]) : '.....................................' }}</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Page break for IAR & Terminasi to avoid overflow -->
        <div style="page-break-before: always; height: 1px;"></div>

        <!-- IAR Table -->
        <div class="section-title text-center bold" style="background-color: #d9d9d9; margin-top: 10px; margin-bottom: 5px;">IAR : INFORMASI, ANALISIS RENCANA (CATATAN IMPLEMENTASI)</div>
        <table class="table-bordered" style="margin-bottom: 15px;">
            <thead>
                <tr>
                    <th width="15%">TANGGAL / JAM</th>
                    <th width="65%">IAR : INFORMASI, ANALISIS RENCANA</th>
                    <th width="20%">NAMA DAN TANDA TANGAN</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $iarRows = [
                        ['t' => 1901310148, 'i' => 1901310149, 'p' => 1901310150],
                        ['t' => 1901310151, 'i' => 1901310152, 'p' => 1901310153],
                        ['t' => 1901310154, 'i' => 1901310155, 'p' => 1901310156],
                        ['t' => 1901310157, 'i' => 1901310158, 'p' => 1901310159],
                        ['t' => 1901310160, 'i' => 1901310161, 'p' => 1901310162],
                        ['t' => 1901310163, 'i' => 1901310164, 'p' => 1901310165],
                    ];
                    $hasAnyIar = false;
                    foreach ($iarRows as $row) {
                        if (isset($item[$row['t']]) || isset($item[$row['i']]) || isset($item[$row['p']])) {
                            $hasAnyIar = true;
                        }
                    }
                @endphp

                @if($hasAnyIar)
                    @foreach($iarRows as $row)
                        @if(isset($item[$row['t']]) || isset($item[$row['i']]) || isset($item[$row['p']]))
                            <tr>
                                <td class="text-center text-middle bold">{{ $item[$row['t']] ?? '-' }}</td>
                                <td class="text-top" style="white-space: pre-line;">{!! isset($item[$row['i']]) ? e($item[$row['i']]) : '-' !!}</td>
                                <td class="text-top">
                                    <div class="signature-area" style="padding-top: 10px;">
                                        <div class="signature-space" style="height: 30px;"></div>
                                        <div class="bold">{{ isset($item[$row['p']]) ? formatCombo($item[$row['p']]) : '.....................................' }}</div>
                                    </div>
                                </td>
                            </tr>
                        @endif
                    @endforeach
                @else
                    <tr>
                        <td colspan="3" class="text-center" style="padding: 10px; color: #666; font-style: italic;">
                            Belum ada implementasi IAR yang dicatat.
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>

        <!-- Hasil Pelayanan dan Terminasi MPP -->
        <div class="section-title text-center bold" style="background-color: #d9d9d9; margin-bottom: 5px;">HASIL PELAYANAN DAN TERMINASI MPP</div>
        <table class="table-bordered">
            <thead>
                <tr>
                    <th width="15%">TANGGAL / JAM</th>
                    <th width="65%">HASIL PELAYANAN DAN TERMINASI</th>
                    <th width="20%">NAMA DAN TANDA TANGAN</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center text-middle bold">
                        {{ $item[1901310166] ?? '-' }}
                    </td>
                    <td class="text-top">
                        <div class="sub-section">
                            <div class="sub-title">Hasil Pelayanan :</div>
                            <div style="white-space: pre-line; margin-left: 5px;">{!! isset($item[1901310167]) ? e($item[1901310167]) : '-' !!}</div>
                        </div>
                        <div class="sub-section" style="margin-top: 8px;">
                            <div class="sub-title">Terminasi MPP :</div>
                            <div style="white-space: pre-line; margin-left: 5px;">{!! isset($item[1901310168]) ? e($item[1901310168]) : '-' !!}</div>
                        </div>
                    </td>
                    <td class="text-top">
                        <div class="signature-area" style="padding-top: 30px;">
                            <div>Manajer Pelayanan Pasien,</div>
                            <div class="signature-space"></div>
                            <div class="bold">{{ isset($item[1901310169]) ? formatCombo($item[1901310169]) : '.....................................' }}</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

    </section>
</body>

</html>
