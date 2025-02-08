<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

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
                    <tr>
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
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv1[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv1[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv1[$keybln],2,',','.') }}</td>
                        @endforeach
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
                    <tr>
                        <td>{{ $rek->koderekeninglevel2 }}</td>
                        <td>{{ $rek->namarekeninglevel2 }}</td>
                        <td>{{ number_format($targetlv2,2,',','.') }}</td>
                        <td>{{ number_format($targetlv2,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv2[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv2[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv2[$keybln],2,',','.') }}</td>
                        @endforeach
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
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel3 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel3 }}</td>
                        <td>{{ number_format($targetlv3,2,',','.') }}</td>
                        <td>{{ number_format($targetlv3,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv3[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv3[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv3[$keybln],2,',','.') }}</td>
                        @endforeach
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
                    <tr>
                        <td>{{ $rek->koderekeninglevel4 }}</td>
                        <td>{{ $rek->namarekeninglevel4 }}</td>
                        <td>{{ number_format($targetlv4,2,',','.') }}</td>
                        <td>{{ number_format($targetlv4,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv4[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv4[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv4[$keybln],2,',','.') }}</td>
                        @endforeach
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
                    <tr>
                        <td>{{ $rek->koderekeninglevel5 }}</td>
                        <td>{{ $rek->namarekeninglevel5 }}</td>
                        <td>{{ number_format($targetlv5,2,',','.') }}</td>
                        <td>{{ number_format($targetlv5,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv5[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv5[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv5[$keybln],2,',','.') }}</td>
                        @endforeach
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
                    <tr>
                        <td>{{ $rek->koderekeninglevel6 }}</td>
                        <td>{{ $rek->namarekeninglevel6 }}</td>
                        <td>{{ number_format($targetlv6,2,',','.') }}</td>
                        <td>{{ number_format($targetlv6,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv6[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv6[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv6[$keybln],2,',','.') }}</td>
                        @endforeach
                    </tr>
                @endif

                {{-- level-7 --}}
                @if ($rek->idlevel7 && ($rek->idlevel7 !== $idlevel7))
                    @php
                        $targetlv7 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel7 == $rek->idlevel7){
                                $targetlv7 += $tg->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel7 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel7 }}</td>
                        <td>{{ number_format($targetlv7,2,',','.') }}</td>
                        <td>{{ number_format($targetlv7,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv7[$keybln] = 0;
                                foreach ($targetawal as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv7[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv7[$keybln],2,',','.') }}</td>
                        @endforeach
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
                    <td>{{ $rek->koderekening }}</td>
                    <td>{{ $rek->namarekening }}</td>
                    <td>{{ number_format($targetlv8,2,',','.') }}</td>
                    <td>{{ number_format($targetlv8,2,',','.') }}</td>
                    @foreach ($bulan as $keybln => $item)
                        @php
                            $jumlahpendapatanlv8[$keybln] = 0;
                            foreach ($targetawal as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening && $keybln + 1 == $row->bulan){
                                    $jumlahpendapatanlv8[$keybln] += $row->jumlahpendapatan;
                                }
                            }
                        @endphp
                        <td>{{ number_format($jumlahpendapatanlv8[$keybln],2,',','.') }}</td>
                    @endforeach
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
                <th>Kode Rekening</th>
                <th>Uraian</th>
                <th>TARGET PENDAPATAN</th>
                <th>USULAN PERUBAHAN</th>
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
                    <tr>
                        @php
                            $targetawallv1 = 0;
                            $targetakhirlv1 = 0;

                            foreach ($targetawal as $tg) {
                                if($tg->idlevel1 == $rek->idlevel1){
                                    $targetawallv1 += $tg->jumlahpendapatan;
                                }
                            }

                            foreach ($targetakhir as $tgak) {
                                if($tgak->idlevel1 == $rek->idlevel1){
                                    $targetakhirlv1 += $tgak->jumlahpendapatan;
                                }
                            }
                        @endphp
                        <td>{{ $rek->koderekeninglevel1 }}</td>
                        <td>{{ $rek->namarekeninglevel1 }}</td>
                        <td>{{ number_format($targetawallv1,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv1,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv1[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv1[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv1[$keybln],2,',','.') }}</td>
                        @endforeach
                    </tr>
                @endif

                {{-- level-2 --}}
                @if ($rek->idlevel2 && ($rek->idlevel2 !== $idlevel2))
                    @php
                        $targetawallv2 = 0;
                        $targetakhirlv2 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel2 == $rek->idlevel2){
                                $targetawallv2 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgak) {
                            if($tgak->idlevel2 == $rek->idlevel2){
                                $targetakhirlv2 += $tgak->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $rek->koderekeninglevel2 }}</td>
                        <td>{{ $rek->namarekeninglevel2 }}</td>
                        <td>{{ number_format($targetawallv2,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv2,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv2[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv2[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv2[$keybln],2,',','.') }}</td>
                        @endforeach
                    </tr>
                @endif

                {{-- level-3 --}}
                @if ($rek->idlevel3 && ($rek->idlevel3 !== $idlevel3))
                    @php
                        $targetawallv3 = 0;
                        $targetakhirlv3 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel3 == $rek->idlevel3){
                                $targetawallv3 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgak) {
                            if($tgak->idlevel3 == $rek->idlevel3){
                                $targetakhirlv3 += $tgak->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel3 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel3 }}</td>
                        <td>{{ number_format($targetawallv3,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv3,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv3[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3 && $keybln + 1 == $row->bulan){
                                        $jumlahpendapatanlv3[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv3[$keybln],2,',','.') }}</td>
                        @endforeach
                    </tr>
                @endif

                {{-- level-4 --}}
                @if ($rek->idlevel4 && ($rek->idlevel4 !== $idlevel4))
                    @php
                        $targetawallv4 = 0;
                        $targetakhirlv4 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel4 == $rek->idlevel4){
                                $targetawallv4 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgak) {
                            if($tgak->idlevel4 == $rek->idlevel4){
                                $targetakhirlv4 += $tgak->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $rek->koderekeninglevel4 }}</td>
                        <td>{{ $rek->namarekeninglevel4 }}</td>
                        <td>{{ number_format($targetawallv4,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv4,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv4[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv4[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv4[$keybln],2,',','.') }}</td>
                        @endforeach
                    </tr>
                @endif

                {{-- level-5 --}}
                @if ($rek->idlevel5 && ($rek->idlevel5 !== $idlevel5))
                    @php
                        $targetawallv5 = 0;
                        $targetakhirlv5 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel5 == $rek->idlevel5){
                                $targetawallv5 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgak) {
                            if($tgak->idlevel5 == $rek->idlevel5){
                                $targetakhirlv5 += $tgak->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $rek->koderekeninglevel5 }}</td>
                        <td>{{ $rek->namarekeninglevel5 }}</td>
                        <td>{{ number_format($targetawallv5,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv5,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv5[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv5[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv5[$keybln],2,',','.') }}</td>
                        @endforeach
                    </tr>
                @endif

                {{-- level-6 --}}
                @if ($rek->idlevel6 && ($rek->idlevel6 !== $idlevel6))
                    @php
                        $targetawallv6 = 0;
                        $targetakhirlv6 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel6 == $rek->idlevel6){
                                $targetawallv6 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgak) {
                            if($tgak->idlevel6 == $rek->idlevel6){
                                $targetakhirlv6 += $tgak->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $rek->koderekeninglevel6 }}</td>
                        <td>{{ $rek->namarekeninglevel6 }}</td>
                        <td>{{ number_format($targetawallv6,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv6,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv6[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv6[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv6[$keybln],2,',','.') }}</td>
                        @endforeach
                    </tr>
                @endif

                {{-- level-7 --}}
                @if ($rek->idlevel7 && ($rek->idlevel7 !== $idlevel7))
                    @php
                        $targetawallv7 = 0;
                        $targetakhirlv7 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel7 == $rek->idlevel7){
                                $targetawallv7 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgak) {
                            if($tgak->idlevel7 == $rek->idlevel7){
                                $targetakhirlv7 += $tgak->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel7 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel7 }}</td>
                        <td>{{ number_format($targetawallv7,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv7,2,',','.') }}</td>
                        @foreach ($bulan as $keybln => $item)
                            @php
                                $jumlahpendapatanlv7[$keybln] = 0;
                                foreach ($targetakhir as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7 && $keybln + 1 == (int)$row->bulan){
                                        $jumlahpendapatanlv7[$keybln] += $row->jumlahpendapatan;
                                    }
                                }
                            @endphp
                            <td>{{ number_format($jumlahpendapatanlv7[$keybln],2,',','.') }}</td>
                        @endforeach
                    </tr>
                @endif

                <tr>
                    @php
                        $targetawallv8 = 0;
                        $targetakhirlv8 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idrekening == $rek->idrekening){
                                $targetawallv8 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgak) {
                            if($tgak->idrekening == $rek->idrekening){
                                $targetakhirlv8 += $tgak->jumlahpendapatan;
                            }
                        }
                    @endphp
                    <td>{{ $rek->koderekening }}</td>
                    <td>{{ $rek->namarekening }}</td>
                    <td>{{ number_format($targetawallv8,2,',','.') }}</td>
                    <td>{{ number_format($targetakhirlv8,2,',','.') }}</td>
                    @foreach ($bulan as $keybln => $item)
                        @php
                            $jumlahpendapatanlv8[$keybln] = 0;
                            foreach ($targetakhir as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening && $keybln + 1 == $row->bulan){
                                    $jumlahpendapatanlv8[$keybln] = $row->jumlahpendapatan;
                                }
                            }
                        @endphp
                        <td>{{ number_format($jumlahpendapatanlv8[$keybln],2,',','.') }}</td>
                    @endforeach
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
