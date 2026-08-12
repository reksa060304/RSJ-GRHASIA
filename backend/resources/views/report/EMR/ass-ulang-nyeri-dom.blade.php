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
    <title>Pengkajian Ulang Nyeri</title>
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
        <table cellspacing="0" cellpadding="0" border="0" class="header-table" style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
            <tr>
                <td style="text-align: left; vertical-align: middle; width: 11%;">
                    <img src="img/diy.png" alt="Logo DIY" style="width: 80px; height: auto; margin: 0; padding: 0;">
                </td>
                <td style="text-align: center; vertical-align: middle; width: 43%;">
                    <p style="margin: 0; padding: 0; font-size: 13px; font-weight: bold; letter-spacing: 0.2px; line-height: 1.2;">
                        PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA
                    </p>
                    <p style="margin: 2px 0 0 0; padding: 0; font-size: 13px; font-weight: bold; letter-spacing: 0.2px; line-height: 1.2;">
                        DINAS KESEHATAN
                    </p>
                    <p style="margin: 2px 0 0 0; padding: 0; font-size: 13px; font-weight: bold; letter-spacing: 0.2px; line-height: 1.2;">
                        RUMAH SAKIT JIWA GRHASIA
                    </p>
                    <img src="img/aksara_jawa-com.png" alt="Aksara Jawa" style="width: 140px; height: auto; margin-top: 2px;"><br>
                    <p style="font-size: 9px; margin: 3px 0 0 0; line-height: 1.2; color: #000;">
                        Jalan Kaliurang KM 17 Sleman, Kode Pos {{ $res['profile']->kodepos }}, Telepon: (0274) 895143, 895297
                    </p>
                    <p style="font-size: 9px; margin: 1px 0 0 0; line-height: 1.2; color: #000;">
                        Faksimile: {{ $res['profile']->faksimile }}, Pos-el: <a href="mailto:grhasiasmentalhospital@jogjaprov.go.id" style="color: #00f; text-decoration: underline;">grhasiasmentalhospital@jogjaprov.go.id</a>
                    </p>
                    <p style="font-size: 9px; margin: 1px 0 0 0; line-height: 1.2; color: #000;">
                        Laman: grhasia.jogjaprov.go.id
                    </p>
                </td>
                <td style="text-align: center; vertical-align: middle; width: 14%;">
                    <img src="img/logo_grhasia_full.png" alt="Logo Grhasia" style="width: 100px; height: auto; margin: 0; padding: 0;">
                </td>
                <td style="vertical-align: middle; width: 32%; padding-left: 10px;">
                    <div style="border: 1px solid #000; padding: 6px; font-size: 9.5px; line-height: 1.3;">
                        <table style="width: 100%; border: none;">
                            <tr>
                                <td style="border: none; padding: 2px 0; font-weight: bold; width: 36%; font-size: 9.5px; vertical-align: middle;">No. RM</td>
                                <td style="border: none; padding: 2px 0; font-weight: bold; width: 5%; font-size: 9.5px; vertical-align: middle;">:</td>
                                <td style="border: none; padding: 2px 0; font-size: 10px; font-weight: bold; vertical-align: middle;">{{ $data[0]->nocm }}</td>
                            </tr>
                            <tr>
                                <td style="border: none; padding: 2px 0; font-weight: bold; font-size: 9.5px; vertical-align: middle;">Nama</td>
                                <td style="border: none; padding: 2px 0; font-weight: bold; font-size: 9.5px; vertical-align: middle;">:</td>
                                <td style="border: none; padding: 2px 0; font-size: 9.5px; vertical-align: middle;">{{ $data[0]->namapasien }}</td>
                            </tr>
                            <tr>
                                <td style="border: none; padding: 2px 0; font-weight: bold; font-size: 9.5px; vertical-align: middle;">Tgl Lahir</td>
                                <td style="border: none; padding: 2px 0; font-weight: bold; font-size: 9.5px; vertical-align: middle;">:</td>
                                <td style="border: none; padding: 2px 0; font-size: 9.5px; vertical-align: middle;">{{ date('d-m-Y', strtotime($data[0]->tgllahir)) }}</td>
                            </tr>
                            <tr>
                                <td style="border: none; padding: 2px 0; font-weight: bold; font-size: 9.5px; vertical-align: middle;">Jenis Kelamin</td>
                                <td style="border: none; padding: 2px 0; font-weight: bold; font-size: 9.5px; vertical-align: middle;">:</td>
                                <td style="border: none; padding: 2px 0; font-size: 9.5px; vertical-align: middle;">{{ $data[0]->jeniskelamin }}</td>
                            </tr>
                        </table>
                        <div style="border-top: 1px solid #000; margin-top: 5px; padding-top: 4px; font-size: 7px; font-style: italic; color: #444; text-align: center; line-height: 1.0;">
                            (Mohon diisi huruf kapital atau tempelkan stiker jika ada)
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="4" style="border: none; padding: 0;">
                    <div style="border-top: 2px solid #000; border-bottom: 1px solid #000; height: 1px; margin-top: 2px; padding: 0; margin-bottom: 5px;"></div>
                </td>
            </tr>
            <tr>
                <th style="font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="4">Pengkajian Ulang Nyeri</th>
            </tr>
        </table>
        <div style="padding: 10px;">
            <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px;" border="1">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="width: 100%;" colspan="7">Skala yang digunakan NUMERIC / WONG BAKER / NIPS / FLACC PAIN SCALE *</th>
                </tr>
            </thead>
            <tbody>
                {{-- <tr>
                    <td width="18%"><b>Rumah Sakit</b></td>
                    <td width="2%">:</td>
                    <td width="80%">{{ strtoupper($res['profile']->namalengkap) }}</td>
                </tr> --}}
                <tr>
                    <td><b>Tanggal</b></td>
                    <td>{{ !empty($item[1901300501]) ? date('d-m-Y', strtotime($item[1901300501])) : '' }}</td>
                    <td>{{ !empty($item[1901300502]) ? date('d-m-Y', strtotime($item[1901300502])) : '' }}</td>
                    <td>{{ !empty($item[1901300503]) ? date('d-m-Y', strtotime($item[1901300503])) : '' }}</td>
                    <td>{{ !empty($item[1901300504]) ? date('d-m-Y', strtotime($item[1901300504])) : '' }}</td>
                    <td>{{ !empty($item[1901300505]) ? date('d-m-Y', strtotime($item[1901300505])) : '' }}</td>
                    <td>{{ !empty($item[1901300506]) ? date('d-m-Y', strtotime($item[1901300506])) : '' }}</td>
                </tr>
                <tr>
                    <td><b>Pukul</b></td>
                    <td>{{ !empty($item[1901300507]) ? date('H:i', strtotime($item[1901300507])) : '' }}</td>
                    <td>{{ !empty($item[1901300508]) ? date('H:i', strtotime($item[1901300508])) : '' }}</td>
                    <td>{{ !empty($item[1901300509]) ? date('H:i', strtotime($item[1901300509])) : '' }}</td>
                    <td>{{ !empty($item[1901300510]) ? date('H:i', strtotime($item[1901300510])) : '' }}</td>
                    <td>{{ !empty($item[1901300511]) ? date('H:i', strtotime($item[1901300511])) : '' }}</td>
                    <td>{{ !empty($item[1901300512]) ? date('H:i', strtotime($item[1901300512])) : '' }}</td>
                </tr>
                <tr>
                    <td><b>Skor Nyeri</b></td>
                    <td>{{ $item[1901300513] ?? '' }}</td>
                    <td>{{ $item[1901300514] ?? '' }}</td>
                    <td>{{ $item[1901300515] ?? '' }}</td>
                    <td>{{ $item[1901300516] ?? '' }}</td>
                    <td>{{ $item[1901300517] ?? '' }}</td>
                    <td>{{ $item[1901300518] ?? '' }}</td>
                </tr>
            </tbody>
            </table>
            <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px; text-align: left; margin-top: 10px;" border="1">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="width: 35%;">Tingkat Nyeri</th>
                    <th style="width: 65%;">Interval Re-Asesmen Nyeri</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>1 - 3</strong> (Nyeri Mild / Ringan)
                    </td>
                    <td>
                        <ul>
                            <li>1 kali / shift</li>
                            <li>15 menit setelah obat injeksi</li>
                            <li>1 jam setelah obat oral</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <strong>4 - 6</strong> (Nyeri Moderate / Sedang)
                    </td>
                    <td>
                        <ul>
                            <li>Tiap 3 jam</li>
                            <li>15 menit setelah obat injeksi</li>
                            <li>1 jam setelah obat oral</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <strong>7 - 10</strong> (Nyeri Severe / Berat)
                    </td>
                    <td>
                        <ul>
                            <li>Tiap 1 jam</li>
                            <li>15 menit setelah obat injeksi</li>
                            <li>1 jam setelah obat oral</li>
                        </ul>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="font-size: 11px; font-style: italic; background-color: #fafafa;">
                        * Coret yang tidak digunakan
                    </td>
                </tr>
            </tfoot>
        </table>
            {{-- <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px;" border="0" class="header-table">
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
            </table> --}}
        </div>
    </section>
</body>
</html>

