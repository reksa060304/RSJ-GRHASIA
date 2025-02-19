<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Target Pendapatan Bendahara Penerimaan</title>
    
    <style>
        /* @font-face {
            font-family: 'BookmanOldStyle';
            src: url('{{ asset('fonts/BookmanOldStyle.TTF') }}')
        } */

        @page {
            font-family: Arial, Helvetica, sans-serif;
            size: 33cm 21.5cm;
            font-size: 10pt;
        }

        p {
            line-height: 1.5;
            margin: 0;
        }
        .newpage { margin-top: 1.5cm; page-break-before: always; }
        body {
            font-family: 'BookmanOldStyle';
            margin: 0;
        }
        #table-target {
            border-collapse: collapse;
            font-size: 10pt;
            margin-top: 1em;
        }
        #table-target thead tr th {
            border: 1px solid black;
            padding: .3em .6em;
        }
        #table-target tbody tr td {
            border: 1px solid black;
            padding: .3em .6em;
        }
    </style>
</head>

<body>
    <table style="font-weight:bold;" cellspacing="0" cellpadding="0" width="100%">
        <tr>
            <td style="text-align: center;">
                TARGET PENDAPATAN RUMAH SAKIT JIWA GRHASIA {{ $tahun }}
            </td>
        </tr>
        <tr>
            <td>SEMULA</td>
        </tr>
    </table>

    <table id="table-target" cellspacing="0" cellpadding="0" width="100%">
        <thead>
            <tr>
                <th rowspan="2">Kode Rekening</th>
                <th rowspan="2">Uraian</th>
                <th rowspan="2">TARGET PENDAPATAN</th>
                <th rowspan="2">ANGKAS</th>
                <th colspan="{{ count($bulan) }}">Rincian Angkas</th>
            </tr>
            <tr>
                @foreach ($bulan as $item)
                    <th>{{ $item }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @php
                $idlevel1 = 0;
                $idlevel2 = 0;
                $idlevel3 = 0;
                $idlevel4 = 0;
                $idlevel5 = 0;
                $idlevel6 = 0;
                $idlevel7 = 0;
            @endphp
            @foreach ($rekening as $rek)
                {{-- level-1 --}}
                @if ($rek->idlevel1 && ($rek->idlevel1 !== $idlevel1))
                    <tr style="font-weight: bold;">
                        @php
                            $targetlv1 = 0;

                            foreach ($targetawal as $tg) {
                                if($tg->idlevel1 == $rek->idlevel1){
                                    $targetlv1 += $tg->jumlahpendapatan;
                                }
                            }
                        @endphp
                        <td>{{ $rek->koderekeninglevel1 }}</td>
                        <td>{{ $rek->namarekeninglevel1 }}</td>
                        <td>{{ number_format($targetlv1,2,',','.') }}</td>
                        <td>{{ number_format($targetlv1,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahJanuariLv1 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahFebruariLv1 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahMaretLv1 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahAparilLv1 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahMeiLv1 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahJuniLv1 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahJuliLv1 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahAgustusLv1 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahSeptemberLv1 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahOktoberLv1 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahNovemberLv1 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv1 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahDesemberLv1 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv1,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv1[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv1[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv1[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-2 --}}
                @if ($rek->idlevel2 && ($rek->idlevel2 !== $idlevel2))
                    @php
                        $targetlv2 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel2 == $rek->idlevel2){
                                $targetlv2 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $rek->koderekeninglevel2 }}</td>
                        <td>{{ $rek->namarekeninglevel2 }}</td>
                        <td>{{ number_format($targetlv2,2,',','.') }}</td>
                        <td>{{ number_format($targetlv2,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahJanuariLv2 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahFebruariLv2 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahMaretLv2 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahAparilLv2 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahMeiLv2 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahJuniLv2 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahJuliLv2 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahAgustusLv2 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahSeptemberLv2 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahOktoberLv2 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahNovemberLv2 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv2 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahDesemberLv2 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv2,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv2[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv2[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv2[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-3 --}}
                @if ($rek->idlevel3 && ($rek->idlevel3 !== $idlevel3))
                    @php
                        $targetlv3 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel3 == $rek->idlevel3){
                                $targetlv3 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel3 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel3 }}</td>
                        <td>{{ number_format($targetlv3,2,',','.') }}</td>
                        <td>{{ number_format($targetlv3,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahJanuariLv3 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahFebruariLv3 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahMaretLv3 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahAparilLv3 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahMeiLv3 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahJuniLv3 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahJuliLv3 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahAgustusLv3 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahSeptemberLv3 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahOktoberLv3 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahNovemberLv3 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv3 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahDesemberLv3 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv3,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv3[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv3[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv3[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-4 --}}
                @if ($rek->idlevel4 && ($rek->idlevel4 !== $idlevel4))
                    @php
                        $targetlv4 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel4 == $rek->idlevel4){
                                $targetlv4 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $rek->koderekeninglevel4 }}</td>
                        <td>{{ $rek->namarekeninglevel4 }}</td>
                        <td>{{ number_format($targetlv4,2,',','.') }}</td>
                        <td>{{ number_format($targetlv4,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahJanuariLv4 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahFebruariLv4 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahMaretLv4 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahAparilLv4 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahMeiLv4 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahJuniLv4 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahJuliLv4 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahAgustusLv4 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahSeptemberLv4 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahOktoberLv4 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahNovemberLv4 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv4 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahDesemberLv4 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv4,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv4[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv4[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv4[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-5 --}}
                @if ($rek->idlevel5 && ($rek->idlevel5 !== $idlevel5))
                    @php
                        $targetlv5 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel5 == $rek->idlevel5){
                                $targetlv5 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $rek->koderekeninglevel5 }}</td>
                        <td>{{ $rek->namarekeninglevel5 }}</td>
                        <td>{{ number_format($targetlv5,2,',','.') }}</td>
                        <td>{{ number_format($targetlv5,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahJanuariLv5 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahFebruariLv5 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahMaretLv5 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahAparilLv5 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahMeiLv5 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahJuniLv5 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahJuliLv5 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahAgustusLv5 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahSeptemberLv5 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahOktoberLv5 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahNovemberLv5 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv5 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahDesemberLv5 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv5,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv5[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv5[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv5[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-6 --}}
                @if ($rek->idlevel6 && ($rek->idlevel6 !== $idlevel6))
                    @php
                        $targetlv6 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel6 == $rek->idlevel6){
                                $targetlv6 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $rek->koderekeninglevel6 }}</td>
                        <td>{{ $rek->namarekeninglevel6 }}</td>
                        <td>{{ number_format($targetlv6,2,',','.') }}</td>
                        <td>{{ number_format($targetlv6,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahJanuariLv6 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahFebruariLv6 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahMaretLv6 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahAparilLv6 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahMeiLv6 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahJuniLv6 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahJuliLv6 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahAgustusLv6 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahSeptemberLv6 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahOktoberLv6 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahNovemberLv6 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv6 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahDesemberLv6 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv6,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv6[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv6[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv6[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-7 --}}
                @if ($rek->idlevel7 && ($rek->idlevel7 !== $idlevel7) && str_contains($rek->koderekeninglevel4, '4.1.02.01'))
                    @php
                        $targetlv7 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel7 == $rek->idlevel7){
                                $targetlv7 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td></td>
                        <td>{{ $rek->namarekeninglevel7 }}</td>
                        <td>{{ number_format($targetlv7,2,',','.') }}</td>
                        <td>{{ number_format($targetlv7,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahJanuariLv7 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahFebruariLv7 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahMaretLv7 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahAparilLv7 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahMeiLv7 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahJuniLv7 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahJuliLv7 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahAgustusLv7 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahSeptemberLv7 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahOktoberLv7 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahNovemberLv7 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv7 = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahDesemberLv7 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv7,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv7[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv7[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv7[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                <tr>
                    @php
                        $targetlv8 = 0;
                        $targetakhirlv8 = 0;
                        $bulanlalulv8 = 0;
                        $bulaninilv8 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idrekening == $rek->idrekening){
                                $targetlv8 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <td></td>
                    <td>{{ $rek->namarekening }}</td>
                    <td>{{ number_format($targetlv8,2,',','.') }}</td>
                    <td>{{ number_format($targetlv8,2,',','.') }}</td>
                    <td>
                        @php
                            $jumlahJanuariLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahJanuariLv8 += $row->januari;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahJanuariLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahFebruariLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahFebruariLv8 += $row->februari;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahFebruariLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahMaretLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahMaretLv8 += $row->maret;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahMaretLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahAparilLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahAparilLv8 += $row->april;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahAparilLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahMeiLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahMeiLv8 += $row->mei;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahMeiLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahJuniLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahJuniLv8 += $row->juni;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahJuniLv8,2,',','.') }}
                    </td>
                    
                    <td>
                        @php
                            $jumlahJuliLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahJuliLv8 += $row->juli;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahJuliLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahAgustusLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahAgustusLv8 += $row->agustus;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahAgustusLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahSeptemberLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahSeptemberLv8 += $row->september;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahSeptemberLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahOktoberLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahOktoberLv8 += $row->oktober;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahOktoberLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahNovemberLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahNovemberLv8 += $row->november;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahNovemberLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahDesemberLv8 = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahDesemberLv8 += $row->desember;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahDesemberLv8,2,',','.') }}
                    </td>
                    <!-- @foreach ($bulan as $keybln => $item)
                        @php
                            $jumlahpendapatanlv8[$keybln] = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening && $keybln + 1 == $row->bulan){
                                    $jumlahpendapatanlv8[$keybln] += $row->jumlahpendapatan;
                                }
                            }
                        @endphp
                        <td>{{ number_format($jumlahpendapatanlv8[$keybln],2,',','.') }}</td>
                    @endforeach -->
                </tr>
                

                @php
                    $idlevel1 = $rek->idlevel1;
                    $idlevel2 = $rek->idlevel2;
                    $idlevel3 = $rek->idlevel3;
                    $idlevel4 = $rek->idlevel4;
                    $idlevel5 = $rek->idlevel5;
                    $idlevel6 = $rek->idlevel6;
                    $idlevel7 = $rek->idlevel7;
                @endphp
            @endforeach
        </tbody>
    </table>

    <table style="font-weight:bold; margin-top:4em;" cellspacing="0" cellpadding="0" width="100%">
        <tr>
            <td style="text-align: center;">
                USULAN PERUBAHAN RINCIAN TARGET PENDAPATAN
            </td>
        </tr>
        <tr>
            <td>MENJADI</td>
        </tr>
    </table>

    <table id="table-target" cellspacing="0" cellpadding="0" width="100%">
        <thead>
            <tr>
                <th rowspan="2">Kode Rekening</th>
                <th rowspan="2">Uraian</th>
                <th rowspan="2">TARGET PENDAPATAN</th>
                <th rowspan="2">ANGKAS</th>
                <th colspan="{{ count($bulan) }}">Rincian Angkas</th>
            </tr>
            <tr>
                @foreach ($bulan as $item)
                    <th>{{ $item }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @php
                $idlevel1 = 0;
                $idlevel2 = 0;
                $idlevel3 = 0;
                $idlevel4 = 0;
                $idlevel5 = 0;
                $idlevel6 = 0;
                $idlevel7 = 0;
            @endphp
            @foreach ($rekening as $rek)
                {{-- level-1 --}}
                @if ($rek->idlevel1 && ($rek->idlevel1 !== $idlevel1))
                    <tr style="font-weight: bold;">
                        @php
                            $targetlv1 = 0;

                            foreach ($targetakhir as $tg) {
                                if($tg->idlevel1 == $rek->idlevel1){
                                    $targetlv1 += $tg->jumlahpendapatan;
                                }
                            }
                        @endphp
                        <td>{{ $rek->koderekeninglevel1 }}</td>
                        <td>{{ $rek->namarekeninglevel1 }}</td>
                        <td>{{ number_format($targetlv1,2,',','.') }}</td>
                        <td>{{ number_format($targetlv1,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahJanuariLv1 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahFebruariLv1 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahMaretLv1 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahAparilLv1 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahMeiLv1 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahJuniLv1 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahJuliLv1 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahAgustusLv1 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahSeptemberLv1 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahOktoberLv1 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahNovemberLv1 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv1 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahDesemberLv1 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv1,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv1[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv1[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv1[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-2 --}}
                @if ($rek->idlevel2 && ($rek->idlevel2 !== $idlevel2))
                    @php
                        $targetlv2 = 0;

                        foreach ($targetakhir as $tg) {
                            if($tg->idlevel2 == $rek->idlevel2){
                                $targetlv2 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $rek->koderekeninglevel2 }}</td>
                        <td>{{ $rek->namarekeninglevel2 }}</td>
                        <td>{{ number_format($targetlv2,2,',','.') }}</td>
                        <td>{{ number_format($targetlv2,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahJanuariLv2 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahFebruariLv2 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahMaretLv2 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahAparilLv2 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahMeiLv2 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahJuniLv2 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahJuliLv2 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahAgustusLv2 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahSeptemberLv2 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahOktoberLv2 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahNovemberLv2 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv2 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahDesemberLv2 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv2,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv2[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv2[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv2[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-3 --}}
                @if ($rek->idlevel3 && ($rek->idlevel3 !== $idlevel3))
                    @php
                        $targetlv3 = 0;

                        foreach ($targetakhir as $tg) {
                            if($tg->idlevel3 == $rek->idlevel3){
                                $targetlv3 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel3 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel3 }}</td>
                        <td>{{ number_format($targetlv3,2,',','.') }}</td>
                        <td>{{ number_format($targetlv3,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahJanuariLv3 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahFebruariLv3 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahMaretLv3 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahAparilLv3 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahMeiLv3 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahJuniLv3 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahJuliLv3 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahAgustusLv3 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahSeptemberLv3 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahOktoberLv3 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahNovemberLv3 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv3 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahDesemberLv3 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv3,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv3[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv3[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv3[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-4 --}}
                @if ($rek->idlevel4 && ($rek->idlevel4 !== $idlevel4))
                    @php
                        $targetlv4 = 0;

                        foreach ($targetakhir as $tg) {
                            if($tg->idlevel4 == $rek->idlevel4){
                                $targetlv4 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $rek->koderekeninglevel4 }}</td>
                        <td>{{ $rek->namarekeninglevel4 }}</td>
                        <td>{{ number_format($targetlv4,2,',','.') }}</td>
                        <td>{{ number_format($targetlv4,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahJanuariLv4 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahFebruariLv4 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahMaretLv4 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahAparilLv4 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahMeiLv4 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahJuniLv4 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahJuliLv4 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahAgustusLv4 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahSeptemberLv4 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahOktoberLv4 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahNovemberLv4 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv4 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahDesemberLv4 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv4,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv4[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv4[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv4[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-5 --}}
                @if ($rek->idlevel5 && ($rek->idlevel5 !== $idlevel5))
                    @php
                        $targetlv5 = 0;

                        foreach ($targetakhir as $tg) {
                            if($tg->idlevel5 == $rek->idlevel5){
                                $targetlv5 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $rek->koderekeninglevel5 }}</td>
                        <td>{{ $rek->namarekeninglevel5 }}</td>
                        <td>{{ number_format($targetlv5,2,',','.') }}</td>
                        <td>{{ number_format($targetlv5,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahJanuariLv5 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahFebruariLv5 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahMaretLv5 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahAparilLv5 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahMeiLv5 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahJuniLv5 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahJuliLv5 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahAgustusLv5 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahSeptemberLv5 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahOktoberLv5 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahNovemberLv5 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv5 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahDesemberLv5 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv5,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv5[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv5[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv5[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-6 --}}
                @if ($rek->idlevel6 && ($rek->idlevel6 !== $idlevel6))
                    @php
                        $targetlv6 = 0;

                        foreach ($targetakhir as $tg) {
                            if($tg->idlevel6 == $rek->idlevel6){
                                $targetlv6 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $rek->koderekeninglevel6 }}</td>
                        <td>{{ $rek->namarekeninglevel6 }}</td>
                        <td>{{ number_format($targetlv6,2,',','.') }}</td>
                        <td>{{ number_format($targetlv6,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahJanuariLv6 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahFebruariLv6 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahMaretLv6 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahAparilLv6 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahMeiLv6 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahJuniLv6 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahJuliLv6 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahAgustusLv6 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahSeptemberLv6 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahOktoberLv6 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahNovemberLv6 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv6 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahDesemberLv6 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv6,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv6[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv6[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv6[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                {{-- level-7 --}}
                @if ($rek->idlevel7 && ($rek->idlevel7 !== $idlevel7) && str_contains($rek->koderekeninglevel4, '4.1.02.01'))
                    @php
                        $targetlv7 = 0;

                        foreach ($targetakhir as $tg) {
                            if($tg->idlevel7 == $rek->idlevel7){
                                $targetlv7 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td></td>
                        <td>{{ $rek->namarekeninglevel7 }}</td>
                        <td>{{ number_format($targetlv7,2,',','.') }}</td>
                        <td>{{ number_format($targetlv7,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahJanuariLv7 += $row->januari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJanuariLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahFebruariLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahFebruariLv7 += $row->februari;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahFebruariLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMaretLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahMaretLv7 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAparilLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahAparilLv7 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAparilLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahMeiLv7 += $row->mei;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMeiLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuniLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahJuniLv7 += $row->juni;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuniLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahJuliLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahJuliLv7 += $row->juli;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahJuliLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAgustusLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahAgustusLv7 += $row->agustus;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAgustusLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahSeptemberLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahSeptemberLv7 += $row->september;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahSeptemberLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahOktoberLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahOktoberLv7 += $row->oktober;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahOktoberLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahNovemberLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahNovemberLv7 += $row->november;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahNovemberLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahDesemberLv7 = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahDesemberLv7 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv7,2,',','.') }}
                        </td>
                        <!-- @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv7[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv7[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv7[$keybln],2,',','.') }}</td>
                        @endforeach -->
                    </tr>
                @endif

                <tr>
                    @php
                        $targetlv8 = 0;
                        $targetakhirlv8 = 0;
                        $bulanlalulv8 = 0;
                        $bulaninilv8 = 0;

                        foreach ($targetakhir as $tg) {
                            if($tg->idrekening == $rek->idrekening){
                                $targetlv8 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <td></td>
                    <td>{{ $rek->namarekening }}</td>
                    <td>{{ number_format($targetlv8,2,',','.') }}</td>
                    <td>{{ number_format($targetlv8,2,',','.') }}</td>
                    <td>
                        @php
                            $jumlahJanuariLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahJanuariLv8 += $row->januari;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahJanuariLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahFebruariLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahFebruariLv8 += $row->februari;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahFebruariLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahMaretLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahMaretLv8 += $row->maret;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahMaretLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahAparilLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahAparilLv8 += $row->april;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahAparilLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahMeiLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahMeiLv8 += $row->mei;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahMeiLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahJuniLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahJuniLv8 += $row->juni;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahJuniLv8,2,',','.') }}
                    </td>
                    
                    <td>
                        @php
                            $jumlahJuliLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahJuliLv8 += $row->juli;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahJuliLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahAgustusLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahAgustusLv8 += $row->agustus;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahAgustusLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahSeptemberLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahSeptemberLv8 += $row->september;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahSeptemberLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahOktoberLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahOktoberLv8 += $row->oktober;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahOktoberLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahNovemberLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahNovemberLv8 += $row->november;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahNovemberLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahDesemberLv8 = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahDesemberLv8 += $row->desember;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahDesemberLv8,2,',','.') }}
                    </td>
                    <!-- @foreach ($bulan as $keybln => $item)
                        @php
                            $jumlahpendapatanlv8[$keybln] = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening && $keybln + 1 == $row->bulan){
                                    $jumlahpendapatanlv8[$keybln] += $row->jumlahpendapatan;
                                }
                            }
                        @endphp
                        <td>{{ number_format($jumlahpendapatanlv8[$keybln],2,',','.') }}</td>
                    @endforeach -->
                </tr>
                

                @php
                    $idlevel1 = $rek->idlevel1;
                    $idlevel2 = $rek->idlevel2;
                    $idlevel3 = $rek->idlevel3;
                    $idlevel4 = $rek->idlevel4;
                    $idlevel5 = $rek->idlevel5;
                    $idlevel6 = $rek->idlevel6;
                    $idlevel7 = $rek->idlevel7;
                @endphp
            @endforeach
        </tbody>
    </table>

    {{-- Tanda tangan --}}
    {{-- <table style="margin-top: 3em;" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td></td>
            <td></td>
            <td style="text-align: center;">Yogyakarta, {{ $tglindo }}</td>
        </tr>
        <tr>
            <td style="text-align: center;">Mengetahui</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: center;">Kuasa Pengguna Anggaran</td>
            <td></td>
            <td style="text-align: center;">Bendahara Penerimaan</td>
        </tr>
        <tr>
            <td><p style="opacity: 0; padding:2em;">kosong</p></td>
            <td><p style="opacity: 0; padding:2em;">kosong</p></td>
            <td><p style="opacity: 0; padding:2em;">kosong</p></td>
        </tr>
        <tr>
            <td style="text-align: center;">dr. AKHMAD AKHADI S., MPH</td>
            <td></td>
            <td style="text-align: center;">SURI HERLINA PARATIWI, S.KM, M.PH</td>
        </tr>
        <tr>
            <td style="text-align: center;">NIP 196807142000121002</td>
            <td></td>
            <td style="text-align: center;">NIP 198604222011012013</td>
        </tr>
    </table> --}}

    <script>
        window.print()
    </script>
</body>

</html>
