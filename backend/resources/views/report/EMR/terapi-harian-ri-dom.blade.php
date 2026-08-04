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
    <title>Terapi Harian Pasien Rawat Inap</title>
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
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="6">Terapi Harian Pasien Rawat Inap</th>
            </tr>
        </table>
        <div style="padding: 10px;">
            <table width="100%" cellspacing="0" cellpadding="4" style="font-size:11px; margin-bottom: 10px;" border="1">
                <tr>
                    <th style="width: 50%;">Tanggal Masuk</th>
                    <th style="width: 50%;">Tanggal Keluar</th>
                </tr>
                <tr>
                    <td>{{ !empty($item[1300000]) ? date('d-m-Y H:i', strtotime($item[1300000])) : '' }}</td>
                    <td>{{ !empty($item[1300001]) ? date('d-m-Y H:i', strtotime($item[1300001])) : '' }}</td>
                </tr>
            </table>

            <table width="100%" cellspacing="0" cellpadding="3" style="font-size:10px;" border="1">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th rowspan="2">No</th>
                        <th rowspan="2">Obat Oral</th>
                        <th rowspan="2">Aturan Pakai</th>
                        <th rowspan="2">High Alert</th>
                        <th colspan="4">{{ !empty($item[1300002]) ? date('d-m-Y', strtotime($item[1300002])) : '' }}</th>
                        <th colspan="4">{{ !empty($item[1300003]) ? date('d-m-Y', strtotime($item[1300003])) : '' }}</th>
                        <th colspan="4">{{ !empty($item[1300004]) ? date('d-m-Y', strtotime($item[1300004])) : '' }}</th>
                        <th colspan="4">{{ !empty($item[1300005]) ? date('d-m-Y', strtotime($item[1300005])) : '' }}</th>
                        <th rowspan="2">Paraf High Alert</th>
                    </tr>
                    <tr style="background-color: #f2f2f2; text-align: center;">
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>{{ $item[1300006] ?? '' }}</td>
                        <td>{{ $item[1300007] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300008] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300009] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300010] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300011] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300012] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300013] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300014] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300015] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300016] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300017] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300018] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300019] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300020] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300021] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300022] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300023] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300501] ?? '') }}</td>
                        <td>{{ $item[1300502] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>{{ $item[1300024] ?? '' }}</td>
                        <td>{{ $item[1300025] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300026] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300027] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300028] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300029] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300030] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300031] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300032] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300033] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300034] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300035] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300036] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300037] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300038] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300039] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300040] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300041] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300503] ?? '') }}</td>
                        <td>{{ $item[1300504] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>{{ $item[1300042] ?? '' }}</td>
                        <td>{{ $item[1300043] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300044] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300045] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300046] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300047] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300048] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300049] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300050] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300051] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300052] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300053] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300054] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300055] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300056] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300057] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300058] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300059] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300505] ?? '') }}</td>
                        <td>{{ $item[1300506] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>{{ $item[1300060] ?? '' }}</td>
                        <td>{{ $item[1300061] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300062] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300063] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300064] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300065] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300066] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300067] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300068] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300069] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300070] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300071] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300072] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300073] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300074] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300075] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300076] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300077] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300507] ?? '') }}</td>
                        <td>{{ $item[1300508] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>{{ $item[1300078] ?? '' }}</td>
                        <td>{{ $item[1300079] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300080] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300081] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300082] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300083] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300084] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300085] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300086] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300087] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300088] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300089] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300090] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300091] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300092] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300093] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300094] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300095] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300509] ?? '') }}</td>
                        <td>{{ $item[1300510] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>{{ $item[1300096] ?? '' }}</td>
                        <td>{{ $item[1300097] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300098] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300099] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300100] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300101] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300102] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300103] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300104] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300105] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300106] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300107] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300108] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300109] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300110] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300111] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300112] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300113] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300511] ?? '') }}</td>
                        <td>{{ $item[1300512] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>{{ $item[1300114] ?? '' }}</td>
                        <td>{{ $item[1300115] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300116] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300117] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300118] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300119] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300120] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300121] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300122] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300123] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300124] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300125] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300126] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300127] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300128] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300129] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300130] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300131] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300513] ?? '') }}</td>
                        <td>{{ $item[1300514] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>{{ $item[1300132] ?? '' }}</td>
                        <td>{{ $item[1300133] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300134] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300135] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300136] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300137] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300138] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300139] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300140] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300141] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300142] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300143] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300144] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300145] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300146] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300147] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300148] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300149] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300515] ?? '') }}</td>
                        <td>{{ $item[1300516] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: center;"><b>Paraf Perawat</b></td>
                        <td>{{ $item[1300150] ?? '' }}</td>
                        <td>{{ $item[1300151] ?? '' }}</td>
                        <td>{{ $item[1300152] ?? '' }}</td>
                        <td>{{ $item[1300153] ?? '' }}</td>
                        <td>{{ $item[1300154] ?? '' }}</td>
                        <td>{{ $item[1300155] ?? '' }}</td>
                        <td>{{ $item[1300156] ?? '' }}</td>
                        <td>{{ $item[1300157] ?? '' }}</td>
                        <td>{{ $item[1300158] ?? '' }}</td>
                        <td>{{ $item[1300159] ?? '' }}</td>
                        <td>{{ $item[1300160] ?? '' }}</td>
                        <td>{{ $item[1300161] ?? '' }}</td>
                        <td>{{ $item[1300162] ?? '' }}</td>
                        <td>{{ $item[1300163] ?? '' }}</td>
                        <td>{{ $item[1300164] ?? '' }}</td>
                        <td>{{ $item[1300165] ?? '' }}</td>
                        <td>{{ $item[1309965] ?? '' }}</td>
                        <td>{{ $item[1309966] ?? '' }}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <th colspan="3">No</th>
                        <th>Obat Topikal</th>
                        <th>Aturan Pakai</th>
                        <th>High Alert</th>
                        <th>P</th>
                        <th>S</th>
                        <th>SR</th>
                        <th>M</th>
                        <th>P</th>
                        <th>S</th>
                        <th>SR</th>
                        <th>M</th>
                        <th>P</th>
                        <th>S</th>
                        <th>SR</th>
                        <th>M</th>
                        <th>P</th>
                        <th>S</th>
                        <th>Paraf High Alert</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>{{ $item[1300166] ?? '' }}</td>
                        <td>{{ $item[1300167] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300168] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300169] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300170] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300171] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300172] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300173] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300174] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300175] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300176] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300177] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300178] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300179] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300180] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300181] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300182] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300183] ?? '') }}</td>
                        <td>{{ getCheckBox($item[13006001] ?? '') }}</td>
                        <td>{{ $item[13006002] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: center;"><b>Paraf Perawat</b></td>
                        <td>{{ $item[1300102] ?? '' }}</td>
                        <td>{{ $item[1300184] ?? '' }}</td>
                        <td>{{ $item[1300185] ?? '' }}</td>
                        <td>{{ $item[1300186] ?? '' }}</td>
                        <td>{{ $item[1300187] ?? '' }}</td>
                        <td>{{ $item[1300188] ?? '' }}</td>
                        <td>{{ $item[1300189] ?? '' }}</td>
                        <td>{{ $item[1300190] ?? '' }}</td>
                        <td>{{ $item[1300191] ?? '' }}</td>
                        <td>{{ $item[1300192] ?? '' }}</td>
                        <td>{{ $item[1300193] ?? '' }}</td>
                        <td>{{ $item[1300194] ?? '' }}</td>
                        <td>{{ $item[1300195] ?? '' }}</td>
                        <td>{{ $item[1300196] ?? '' }}</td>
                        <td>{{ $item[1300197] ?? '' }}</td>
                        <td>{{ $item[1300198] ?? '' }}</td>
                        <td>{{ $item[1300199] ?? '' }}</td>
                        <td>{{ $item[1301101] ?? '' }}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <th rowspan="2">No</th>
                        <th rowspan="2">Obat Injeksi</th>
                        <th rowspan="2">Aturan Pakai</th>
                        <th rowspan="2">High Alert</th>
                        <th colspan="4">{{ !empty($item[1300200]) ? date('d-m-Y', strtotime($item[1300200])) : '' }}</th>
                        <th colspan="4">{{ !empty($item[1300201]) ? date('d-m-Y', strtotime($item[1300201])) : '' }}</th>
                        <th colspan="4">{{ !empty($item[1300202]) ? date('d-m-Y', strtotime($item[1300202])) : '' }}</th>
                        <th colspan="4">{{ !empty($item[1300203]) ? date('d-m-Y', strtotime($item[1300203])) : '' }}</th>
                        <th rowspan="2">Paraf High Alert</th>
                    </tr>
                    <tr style="background-color: #f2f2f2; text-align: center;">
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>{{ $item[1300204] ?? '' }}</td>
                        <td>{{ $item[1300205] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300206] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300207] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300208] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300209] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300210] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300211] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300212] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300213] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300214] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300215] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300216] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300217] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300218] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300219] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300220] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300221] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1307701] ?? '') }}</td>
                        <td>{{ $item[1307702] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>{{ $item[1300222] ?? '' }}</td>
                        <td>{{ $item[1300223] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300224] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300225] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300226] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300227] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300228] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300229] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300230] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300231] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300232] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300233] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300234] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300235] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300236] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300237] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300238] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300239] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1307703] ?? '') }}</td>
                        <td>{{ $item[1307704] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>{{ $item[1300240] ?? '' }}</td>
                        <td>{{ $item[1300241] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300242] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300243] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300244] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300245] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300246] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300247] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300248] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300249] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300250] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300251] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300252] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300253] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300254] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300255] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300256] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300257] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1307705] ?? '') }}</td>
                        <td>{{ $item[1307706] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: center;"><b>Paraf Perawat</b></td>
                        <td>{{ $item[1300258] ?? '' }}</td>
                        <td>{{ $item[1300259] ?? '' }}</td>
                        <td>{{ $item[1300260] ?? '' }}</td>
                        <td>{{ $item[1300261] ?? '' }}</td>
                        <td>{{ $item[1300262] ?? '' }}</td>
                        <td>{{ $item[1300263] ?? '' }}</td>
                        <td>{{ $item[1300264] ?? '' }}</td>
                        <td>{{ $item[1300265] ?? '' }}</td>
                        <td>{{ $item[1300266] ?? '' }}</td>
                        <td>{{ $item[1300267] ?? '' }}</td>
                        <td>{{ $item[1300268] ?? '' }}</td>
                        <td>{{ $item[1300269] ?? '' }}</td>
                        <td>{{ $item[1300270] ?? '' }}</td>
                        <td>{{ $item[1300271] ?? '' }}</td>
                        <td>{{ $item[1300272] ?? '' }}</td>
                        <td>{{ $item[1300273] ?? '' }}</td>
                        <td>{{ $item[1300273] ?? '' }}</td>
                        <td>{{ $item[1300273] ?? '' }}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <th rowspan="2">No</th>
                        <th rowspan="2">Obat Inhalasi</th>
                        <th rowspan="2">Aturan Pakai</th>
                        <th rowspan="2">High Alert</th>
                        <th colspan="4">P</th>
                        <th colspan="4">S</th>
                        <th colspan="4">SR</th>
                        <th colspan="4">M</th>
                        <th rowspan="2">Paraf High Alert</th>
                    </tr>
                    <tr style="background-color: #f2f2f2; text-align: center;">
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                        <th>P</th><th>S</th><th>SR</th><th>M</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>{{ $item[1300276] ?? '' }}</td>
                        <td>{{ $item[1300277] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300278] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300279] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300280] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300281] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300282] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300283] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300284] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300285] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300286] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300287] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300288] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300289] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300290] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300291] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300292] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300293] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1307751] ?? '') }}</td>
                        <td>{{ $item[1307752] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>{{ $item[1300294] ?? '' }}</td>
                        <td>{{ $item[1300295] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300296] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300297] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300298] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300299] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300300] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300301] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300302] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300303] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300304] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300305] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300306] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300307] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300308] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300309] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300310] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300311] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1307753] ?? '') }}</td>
                        <td>{{ $item[1307754] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>{{ $item[1300312] ?? '' }}</td>
                        <td>{{ $item[1300313] ?? '' }}</td>
                        <td>{{ getCheckBox($item[1300314] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300315] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300316] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300317] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300318] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300319] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300320] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300321] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300322] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300323] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300324] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300325] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300326] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300327] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300328] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1300329] ?? '') }}</td>
                        <td>{{ getCheckBox($item[1307755] ?? '') }}</td>
                        <td>{{ $item[1307756] ?? '' }}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: center;"><b>Paraf Perawat</b></td>
                        <td>{{ $item[1300330] ?? '' }}</td>
                        <td>{{ $item[1300331] ?? '' }}</td>
                        <td>{{ $item[1300332] ?? '' }}</td>
                        <td>{{ $item[1300333] ?? '' }}</td>
                        <td>{{ $item[1300334] ?? '' }}</td>
                        <td>{{ $item[1300335] ?? '' }}</td>
                        <td>{{ $item[1300336] ?? '' }}</td>
                        <td>{{ $item[1300337] ?? '' }}</td>
                        <td>{{ $item[1300338] ?? '' }}</td>
                        <td>{{ $item[1300339] ?? '' }}</td>
                        <td>{{ $item[1300340] ?? '' }}</td>
                        <td>{{ $item[1300341] ?? '' }}</td>
                        <td>{{ $item[1300342] ?? '' }}</td>
                        <td>{{ $item[1300343] ?? '' }}</td>
                        <td>{{ $item[1300344] ?? '' }}</td>
                        <td>{{ $item[1300345] ?? '' }}</td>
                        <td>{{ $item[1300741] ?? '' }}</td>
                        <td>{{ $item[1300742] ?? '' }}</td>
                    </tr>
                </tbody>
            </table>

            <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px; margin-top: 10px;" border="0" class="header-table">
                <tr>
                    <td width="60%"></td>
                    <td width="40%" style="text-align: center;">
                        Yogyakarta, {{ !empty($item[1300274]) ? date('d-m-Y H:i', strtotime($item[1300274])) : '' }}<br>
                        Perawat
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="height: 40px;"></td>
                </tr>
                <tr>
                    <td width="60%"></td>
                    <td width="40%" style="text-align: center;">
                        {{ $item[1300275] ?? '' }}
                    </td>
                </tr>
            </table>
        </div>
    </section>
</body>
</html>

