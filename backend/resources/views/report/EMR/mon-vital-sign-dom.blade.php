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
    <title>Monitoring Vital Sign Rawat Intensif</title>
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
                            <td style="font-size: 10px; font-weight: bold;">Jenis Kelamin :</td>nb 
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
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="6">Monitoring Vital Sign Rawat Intensif</th>
            </tr>
        </table>
        <div style="padding: 10px;">
            <table width="100%" cellspacing="0" cellpadding="2" style="font-size:11px;" border="1">
            <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th>Tanggal</th>
                        <th colspan="12">{{ !empty($item[1901305900])? date('d-m-Y', strtotime($item[1901305900])) : '' }}</th>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <th rowspan="2">JAM</th>
                        <th rowspan="2">GCS <br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                            E/V/M
                        </th>
                        <th rowspan="2">TENSI <br>
                            mmHg
                        </th>
                        <th rowspan="2">NADI <br>
                            x/mnt
                        </th>
                        <th rowspan="2">RESP <br>
                            x/mnt
                        </th>
                        <th rowspan="2">SUHU <br>
                            oC
                        </th>
                        <th rowspan="2">MAP <br>
                            mmHg
                        </th>
                        <th rowspan="2">SPO <br>
                            %
                        </th>
                        <th rowspan="2">O2 <br>
                            L/mnt
                        </th>
                        <th colspan="3">INTRA VENA LINE</th>
                        <th rowspan="2">KET</th>
                        
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <th>LINE 1</th>
                        <th>LINE 2</th>
                        <th>LINE 3</th>
                    </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ !empty($item[1901305901])? date('H:i', strtotime($item[1901305901])) : '' }}</td>
                    <td>{{ $item[1901305902] ?? '' }}</td>
                    <td>{{ $item[1901305903] ?? '' }}</td>
                    <td>{{ $item[1901305904] ?? '' }}</td>
                    <td>{{ $item[1901305905] ?? '' }}</td>
                    <td>{{ $item[1901305906] ?? '' }}</td>
                    <td>{{ $item[1901305907] ?? '' }}</td>
                    <td>{{ $item[1901305908] ?? '' }}</td>
                    <td>{{ $item[1901305909] ?? '' }}</td>
                    <td>{{ $item[1901305910] ?? '' }}</td>
                    <td>{{ $item[1901305911] ?? '' }}</td>
                    <td>{{ $item[1901305912] ?? '' }}</td>
                    <td>{{ $item[1901305913] ?? '' }}</td>
                </tr>
                @if(!empty($item[1901305921]))
                <tr>
                    <td>{{ !empty($item[1901305921])? date('H:i', strtotime($item[1901305921])) : '' }}</td>
                    <td>{{ $item[1901305922] ?? '' }}</td>
                    <td>{{ $item[1901305923] ?? '' }}</td>
                    <td>{{ $item[1901305924] ?? '' }}</td>
                    <td>{{ $item[1901305925] ?? '' }}</td>
                    <td>{{ $item[1901305926] ?? '' }}</td>
                    <td>{{ $item[1901305927] ?? '' }}</td>
                    <td>{{ $item[1901305928] ?? '' }}</td>
                    <td>{{ $item[1901305929] ?? '' }}</td>
                    <td>{{ $item[1901305930] ?? '' }}</td>
                    <td>{{ $item[1901305931] ?? '' }}</td>
                    <td>{{ $item[1901305932] ?? '' }}</td>
                    <td>{{ $item[1901305933] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901305941]))
                <tr>
                    <td>{{ !empty($item[1901305941])? date('H:i', strtotime($item[1901305941])) : '' }}</td>
                    <td>{{ $item[1901305942] ?? '' }}</td>
                    <td>{{ $item[1901305943] ?? '' }}</td>
                    <td>{{ $item[1901305944] ?? '' }}</td>
                    <td>{{ $item[1901305945] ?? '' }}</td>
                    <td>{{ $item[1901305946] ?? '' }}</td>
                    <td>{{ $item[1901305947] ?? '' }}</td>
                    <td>{{ $item[1901305948] ?? '' }}</td>
                    <td>{{ $item[1901305949] ?? '' }}</td>
                    <td>{{ $item[1901305950] ?? '' }}</td>
                    <td>{{ $item[1901305951] ?? '' }}</td>
                    <td>{{ $item[1901305952] ?? '' }}</td>
                    <td>{{ $item[1901305953] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901305961]))
                <tr>
                    <td>{{ !empty($item[1901305961])? date('H:i', strtotime($item[1901305961])) : '' }}</td>
                    <td>{{ $item[1901305962] ?? '' }}</td>
                    <td>{{ $item[1901305963] ?? '' }}</td>
                    <td>{{ $item[1901305964] ?? '' }}</td>
                    <td>{{ $item[1901305965] ?? '' }}</td>
                    <td>{{ $item[1901305966] ?? '' }}</td>
                    <td>{{ $item[1901305967] ?? '' }}</td>
                    <td>{{ $item[1901305968] ?? '' }}</td>
                    <td>{{ $item[1901305969] ?? '' }}</td>
                    <td>{{ $item[1901305970] ?? '' }}</td>
                    <td>{{ $item[1901305971] ?? '' }}</td>
                    <td>{{ $item[1901305972] ?? '' }}</td>
                    <td>{{ $item[1901305973] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901305981]))
                <tr>
                    <td>{{ !empty($item[1901305981])? date('H:i', strtotime($item[1901305981])) : '' }}</td>
                    <td>{{ $item[1901305982] ?? '' }}</td>
                    <td>{{ $item[1901305983] ?? '' }}</td>
                    <td>{{ $item[1901305984] ?? '' }}</td>
                    <td>{{ $item[1901305985] ?? '' }}</td>
                    <td>{{ $item[1901305986] ?? '' }}</td>
                    <td>{{ $item[1901305987] ?? '' }}</td>
                    <td>{{ $item[1901305988] ?? '' }}</td>
                    <td>{{ $item[1901305989] ?? '' }}</td>
                    <td>{{ $item[1901305990] ?? '' }}</td>
                    <td>{{ $item[1901305991] ?? '' }}</td>
                    <td>{{ $item[1901305992] ?? '' }}</td>
                    <td>{{ $item[1901305993] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901306001]))
                <tr>
                    <td>{{ !empty($item[1901306001])? date('H:i', strtotime($item[1901306001])) : '' }}</td>
                    <td>{{ $item[1901306002] ?? '' }}</n>
                    <td>{{ $item[1901306003] ?? '' }}</td>
                    <td>{{ $item[1901306004] ?? '' }}</td>
                    <td>{{ $item[1901306005] ?? '' }}</td>
                    <td>{{ $item[1901306006] ?? '' }}</td>
                    <td>{{ $item[1901306007] ?? '' }}</td>
                    <td>{{ $item[1901306008] ?? '' }}</td>
                    <td>{{ $item[1901306009] ?? '' }}</td>
                    <td>{{ $item[1901306010] ?? '' }}</td>
                    <td>{{ $item[1901306011] ?? '' }}</td>
                    <td>{{ $item[1901306012] ?? '' }}</td>
                    <td>{{ $item[1901306013] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901306021]))
                <tr>
                    <td>{{ !empty($item[1901306021])? date('H:i', strtotime($item[1901306021])) : '' }}</td>
                    <td>{{ $item[1901306022] ?? '' }}</td>
                    <td>{{ $item[1901306023] ?? '' }}</td>
                    <td>{{ $item[1901306024] ?? '' }}</td>
                    <td>{{ $item[1901306025] ?? '' }}</td>
                    <td>{{ $item[1901306026] ?? '' }}</td>
                    <td>{{ $item[1901306027] ?? '' }}</td>
                    <td>{{ $item[1901306028] ?? '' }}</td>
                    <td>{{ $item[1901306029] ?? '' }}</td>
                    <td>{{ $item[1901306030] ?? '' }}</td>
                    <td>{{ $item[1901306031] ?? '' }}</td>
                    <td>{{ $item[1901306032] ?? '' }}</td>
                    <td>{{ $item[1901306033] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901306041]))
                <tr>
                    <td>{{ !empty($item[1901306041])? date('H:i', strtotime($item[1901306041])) : '' }}</td>
                    <td>{{ $item[1901306042] ?? '' }}</td>
                    <td>{{ $item[1901306043] ?? '' }}</td>
                    <td>{{ $item[1901306044] ?? '' }}</td>
                    <td>{{ $item[1901306045] ?? '' }}</td>
                    <td>{{ $item[1901306046] ?? '' }}</td>
                    <td>{{ $item[1901306047] ?? '' }}</td>
                    <td>{{ $item[1901306048] ?? '' }}</td>
                    <td>{{ $item[1901306049] ?? '' }}</td>
                    <td>{{ $item[1901306050] ?? '' }}</td>
                    <td>{{ $item[1901306051] ?? '' }}</td>
                    <td>{{ $item[1901306052] ?? '' }}</td>
                    <td>{{ $item[1901306053] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901306061]))
                <tr>
                    <td>{{ !empty($item[1901306061])? date('H:i', strtotime($item[1901306061])) : '' }}</td>
                    <td>{{ $item[1901306062] ?? '' }}</td>
                    <td>{{ $item[1901306063] ?? '' }}</td>
                    <td>{{ $item[1901306064] ?? '' }}</td>
                    <td>{{ $item[1901306065] ?? '' }}</td>
                    <td>{{ $item[1901306066] ?? '' }}</td>
                    <td>{{ $item[1901306067] ?? '' }}</td>
                    <td>{{ $item[1901306068] ?? '' }}</td>
                    <td>{{ $item[1901306069] ?? '' }}</td>
                    <td>{{ $item[1901306070] ?? '' }}</td>
                    <td>{{ $item[1901306071] ?? '' }}</td>
                    <td>{{ $item[1901306072] ?? '' }}</td>
                    <td>{{ $item[1901306073] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901306081]))
                <tr>
                    <td>{{ !empty($item[1901306081])? date('H:i', strtotime($item[1901306081])) : '' }}</td>
                    <td>{{ $item[1901306082] ?? '' }}</td>
                    <td>{{ $item[1901306083] ?? '' }}</td>
                    <td>{{ $item[1901306084] ?? '' }}</td>
                    <td>{{ $item[1901306085] ?? '' }}</td>
                    <td>{{ $item[1901306086] ?? '' }}</td>
                    <td>{{ $item[1901306087] ?? '' }}</td>
                    <td>{{ $item[1901306088] ?? '' }}</td>
                    <td>{{ $item[1901306089] ?? '' }}</td>
                    <td>{{ $item[1901306090] ?? '' }}</td>
                    <td>{{ $item[1901306091] ?? '' }}</td>
                    <td>{{ $item[1901306092] ?? '' }}</td>
                    <td>{{ $item[1901306093] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901306101]))
                <tr>
                    <td>{{ !empty($item[1901306101])? date('H:i', strtotime($item[1901306101])) : '' }}</td>
                    <td>{{ $item[1901306102] ?? '' }}</td>
                    <td>{{ $item[1901306103] ?? '' }}</td>
                    <td>{{ $item[1901306104] ?? '' }}</td>
                    <td>{{ $item[1901306105] ?? '' }}</td>
                    <td>{{ $item[1901306106] ?? '' }}</td>
                    <td>{{ $item[1901306107] ?? '' }}</td>
                    <td>{{ $item[1901306108] ?? '' }}</td>
                    <td>{{ $item[1901306109] ?? '' }}</td>
                    <td>{{ $item[1901306110] ?? '' }}</td>
                    <td>{{ $item[1901306111] ?? '' }}</td>
                    <td>{{ $item[1901306112] ?? '' }}</td>
                    <td>{{ $item[1901306113] ?? '' }}</td>
                </tr>
                @endif
                @if(!empty($item[1901306121]))
                <tr>
                    <td>{{ !empty($item[1901306121])? date('H:i', strtotime($item[1901306121])) : '' }}</td>
                    <td>{{ $item[1901306122] ?? '' }}</td>
                    <td>{{ $item[1901306123] ?? '' }}</td>
                    <td>{{ $item[1901306124] ?? '' }}</td>
                    <td>{{ $item[1901306125] ?? '' }}</td>
                    <td>{{ $item[1901306126] ?? '' }}</td>
                    <td>{{ $item[1901306127] ?? '' }}</td>
                    <td>{{ $item[1901306128] ?? '' }}</td>
                    <td>{{ $item[1901306129] ?? '' }}</td>
                    <td>{{ $item[1901306130] ?? '' }}</td>
                    <td>{{ $item[1901306131] ?? '' }}</td>
                    <td>{{ $item[1901306132] ?? '' }}</td>
                    <td>{{ $item[1901306133] ?? '' }}</td>
                </tr>
                @endif
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

