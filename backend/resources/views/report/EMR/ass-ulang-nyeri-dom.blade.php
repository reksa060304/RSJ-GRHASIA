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
        <table cellspacing="0" cellpadding="0" border="0" class="header-table">
            <tr>
                <td style="text-align: center;" width="10%">
                        <img src="img/diy.png" alt="Logo" style="width: 100px; margin: 0 !important;
                        padding: 0 !important;">
                </td>
                <td style="text-align: center;vertical-align: top" width="35%">
                    <p style="margin:0; padding:0; font-size: 10px; font-weight: bold;">{{ $res['profile']->baris1 }}</p>
                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ $res['profile']->baris2 }}</p>
                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ strtoupper($res['profile']->namalengkap) }}</p>
                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;"><br>
                    <p style="font-size:8pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos }}</p>
                    <p style="font-size:8pt; margin:0;">Telp: (0274) 895143, 895297 | Faks: {{ $res['profile']->faksimile }}</p>
                </td>
                <td width="25%" style="vertical-align: middle">
                            <img src="img/logo_grhasia_full.png" alt="Logo" style="width: 180px; margin: 0 !important;
                            padding: 0 !important;">
                </td>
                <td width="30%" style="vertical-align: top">
                    <table width="100%" style="font-size:11px;" border="1" class="header-table">
                        <tr>
                            <td style="font-size: 10px; font-weight: bold;">No. RM :</td>
                            <td style="font-size: 10px;"> {{ $data[0]->nocm }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; font-weight: bold;">Nama :</td>
                            <td style="font-size: 10px;"> {{ $data[0]->namapasien }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; font-weight: bold;">Tgl Lahir :</td>
                            <td style="font-size: 10px;"> {{ date('d-m-Y',strtotime( $data[0]->tgllahir ))  }}  </td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; font-weight: bold;">Jenis Kelamin :</td>
                            <td style="font-size: 10px;"> {{ $data[0]->jeniskelamin }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                    <td colspan="4">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="6">Pengkajian Ulang Nyeri</th>
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

