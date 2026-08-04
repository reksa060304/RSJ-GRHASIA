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
    <title>Rencana Integrasi Asuhan Combined Care Plan</title>
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
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="6">Rencana Integrasi Asuhan Combined Care Plan</th>
            </tr>
        </table>
        <div style="padding: 10px;">
            <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px;" border="1">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>Tanggal</th>
                    <th>Nama dan Paraf Profesi</th>
                    <th>INTEGRASI ASUHAN</th>
                    <th>Catatan / Notasi DPJP</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ !empty($item[3004730])? date('d-m-Y', strtotime($item[3004730])) : '' }}</td>
                    <td>
                        Dokter : {{ $item[3004731] ?? '' }},<br>
                        Perawat : {{ $item[3004732] ?? '' }},<br>
                        PPA Lain : {{ $item[3004733] ?? '' }}
                    </td>
                    <td>{{ $item[3004734] ?? '' }}</td>
                    <td>{{ $item[3004735] ?? '' }}</td>
                </tr>
                <tr>
                    <td>{{ !empty($item[3004736]) ? date('d-m-Y', strtotime($item[3004736])) : '' }}</td>
                    <td>
                        Dokter : {{ $item[3004737] ?? '' }},<br>
                        Perawat : {{ $item[3004738] ?? '' }},<br>
                        PPA Lain : {{ $item[3004739] ?? '' }}
                    </td>
                    <td>{{ $item[3004740] ?? '' }}</td>
                    <td>{{ $item[3004741] ?? '' }}</td>
                </tr>
                <tr>
                    <td>{{ !empty($item[3004742]) ? date('d-m-Y', strtotime($item[3004742])) : '' }}</td>
                    <td>
                        Dokter : {{ $item[3004743] ?? '' }},<br>
                        Perawat : {{ $item[3004744] ?? '' }},<br>
                        PPA Lain : {{ $item[3004745] ?? '' }}
                    </td>
                    <td>{{ $item[3004746] ?? '' }}</td>
                    <td>{{ $item[3004747] ?? '' }}</td>
                </tr>
                <tr>
                    <td>{{ !empty($item[3004748]) ? date('d-m-Y', strtotime($item[3004748])) : '' }}</td>
                    <td>
                        Dokter : {{ $item[3004749] ?? '' }},<br>
                        Perawat : {{ $item[3004750] ?? '' }},<br>
                        PPA Lain : {{ $item[3004751] ?? '' }}
                    </td>
                    <td>{{ $item[3004752] ?? '' }}</td>
                    <td>{{ $item[3004753] ?? '' }}</td>
                </tr>
                <tr>
                    <td>{{ !empty($item[3004754]) ? date('d-m-Y', strtotime($item[3004754])) : '' }}</td>
                    <td>
                        Dokter : {{ $item[3004755] ?? '' }},<br>
                        Perawat : {{ $item[3004756] ?? '' }},<br>
                        PPA Lain : {{ $item[3004757] ?? '' }}
                    </td>
                    <td>{{ $item[3004758] ?? '' }}</td>
                    <td>{{ $item[3004759] ?? '' }}</td>
                </tr>
                <tr>
                    <td>{{ !empty($item[3004760]) ? date('d-m-Y', strtotime($item[3004760])) : '' }}</td>
                    <td>
                        Dokter : {{ $item[3004761] ?? '' }},<br>
                        Perawat : {{ $item[3004762] ?? '' }},<br>
                        PPA Lain : {{ $item[3004763] ?? '' }}
                    </td>
                    <td>{{ $item[3004764] ?? '' }}</td>
                    <td>{{ $item[3004765] ?? '' }}</td>
                </tr>
            </tbody>
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

