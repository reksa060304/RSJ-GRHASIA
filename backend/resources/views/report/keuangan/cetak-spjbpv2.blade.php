<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>SPJ Fungsional Bendahara Penerimaan</title>
    
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
        #table-spjbp {
            border-collapse: collapse;
            font-size: 10pt;
            margin-top: 1em;
        }
        #table-spjbp thead tr th {
            border: 1px solid black;
            padding: .3em .6em;
        }
        #table-spjbp tbody tr td {
            border: 1px solid black;
            padding: .3em .6em;
        }
    </style>
</head>

<body>
    <table style="text-align: center; font-weight:bold;" cellspacing="0" cellpadding="0" width="100%">
        <tr>
            <td>
                PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA
            </td>
        </tr>
        <tr>
            <td>LAPORAN PERTANGGUNGJAWABAN BENDAHARA PENERIMAAN</td>
        </tr>
        <tr>
            <td>(SPJ PENERIMAAN - FUNGSIONAL)</td>
        </tr>
    </table>

    <table style="margin-top: 2em;" cellspacing="0" cellpadding="0" width="50%">
        <tr>
            <td>SKPD</td>
            <td>:</td>
            <td>RS Jiwa Grhasia</td>
        </tr>
        <tr>
            <td>Kuasa Pengguna Anggaran</td>
            <td>:</td>
            <td>dr. AKHMAD AKHADI S., MPH</td>
        </tr>
        <tr>
            <td>Bendahara Penerimaan</td>
            <td>:</td>
            <td>Tutik Herawati</td>
        </tr>
        <tr>
            <td>Tahun Anggaran</td>
            <td>:</td>
            <td>{{ $settingrba->tahunanggaran }}</td>
        </tr>
        <tr>
            <td>Bulan</td>
            <td>:</td>
            <td>{{ $bulan }}</td>
        </tr>
    </table>

    <table id="table-spjbp" cellspacing="0" cellpadding="0" width="100%">
        <thead>
            <tr>
                <th rowspan="2">Kode Rekening</th>
                <th rowspan="2">Uraian</th>
                <th rowspan="2">TARGET PENDAPATAN (tahun) SEMULA</th>
                <th rowspan="2">USULAN PERUBAHAN</th>
                <th colspan="3">Penerimaan</th>
                <th rowspan="2">Sisa Target Pendapatan</th>
                <th rowspan="2">Persentase Pencapaian</th>
            </tr>
            <tr>
                <th>s.d. Bulan lalu</th>
                <th>Bulan ini</th>
                <th>s.d. Bulan ini</th>
            </tr>
            <tr>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th></th>
                <th>4</th>
                <th>5</th>
                <th>6(4+5)</th>
                <th>13</th>
                <th>14</th>
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
                            $targetakhirlv1 = 0;
                            $bulanlalulv1 = 0;
                            $bulaninilv1 = 0;

                            foreach ($targetawal as $tg) {
                                if($tg->idlevel1 == $rek->idlevel1){
                                    $targetlv1 += $tg->jumlahpendapatan;
                                }
                            }

                            foreach ($targetakhir as $tgakhir) {
                                if($tgakhir->idlevel1 == $rek->idlevel1){
                                    $targetakhirlv1 += $tgakhir->jumlahpendapatan;
                                }
                            }

                            foreach ($data as $dt) {
                                if($dt->idlevel1 == $rek->idlevel1){
                                    $bulanlalulv1 += $dt->total_bku_bulan_lalu;
                                    $bulaninilv1 += $dt->total_bku_bulan_ini;
                                }
                            }
                        @endphp
                        <td>{{ $rek->koderekeninglevel1 }}</td>
                        <td>{{ $rek->namarekeninglevel1 }}</td>
                        <td>{{ number_format($targetlv1,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv1,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv1,2,',','.') }}</td>
                        <td>{{ number_format($bulaninilv1,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv1 + $bulaninilv1,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv1 - ($bulanlalulv1 + $bulaninilv1),2,',','.') }}</td>
                        <td>{{ $targetakhirlv1 == 0 ? 0 : (int)((($targetakhirlv1 - ($bulanlalulv1 + $bulaninilv1)) / $targetakhirlv1) * 100) }} %</td>
                    </tr>
                @endif

                {{-- level-2 --}}
                @if ($rek->idlevel2 && ($rek->idlevel2 !== $idlevel2))
                    @php
                        $targetlv2 = 0;
                        $targetakhirlv2 = 0;
                        $bulanlalulv2 = 0;
                        $bulaninilv2 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel2 == $rek->idlevel2){
                                $targetlv2 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgakhir) {
                            if($tgakhir->idlevel2 == $rek->idlevel2){
                                $targetakhirlv2 += $tgakhir->jumlahpendapatan;
                            }
                        }

                        foreach ($data as $dt) {
                            if($dt->idlevel2 == $rek->idlevel2){
                                $bulanlalulv2 += $dt->total_bku_bulan_lalu;
                                $bulaninilv2 += $dt->total_bku_bulan_ini;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $rek->koderekeninglevel2 }}</td>
                        <td>{{ $rek->namarekeninglevel2 }}</td>
                        <td>{{ number_format($targetlv2,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv2,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv2,2,',','.') }}</td>
                        <td>{{ number_format($bulaninilv2,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv2 + $bulaninilv2,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv2 - ($bulanlalulv2 + $bulaninilv2),2,',','.') }}</td>
                        <td>{{ $targetakhirlv2 == 0 ? 0 : (int)((($targetakhirlv2 - ($bulanlalulv2 + $bulaninilv2)) / $targetakhirlv2) * 100) }} %</td>
                    </tr>
                @endif

                {{-- level-3 --}}
                @if ($rek->idlevel3 && ($rek->idlevel3 !== $idlevel3))
                    @php
                        $targetlv3 = 0;
                        $targetakhirlv3 = 0;
                        $bulanlalulv3 = 0;
                        $bulaninilv3 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel3 == $rek->idlevel3){
                                $targetlv3 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgakhir) {
                            if($tgakhir->idlevel3 == $rek->idlevel3){
                                $targetakhirlv3 += $tgakhir->jumlahpendapatan;
                            }
                        }

                        foreach ($data as $dt) {
                            if($dt->idlevel3 == $rek->idlevel3){
                                $bulanlalulv3 += $dt->total_bku_bulan_lalu;
                                $bulaninilv3 += $dt->total_bku_bulan_ini;
                            }
                        }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel3 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel3 }}</td>
                        <td>{{ number_format($targetlv3,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv3,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv3,2,',','.') }}</td>
                        <td>{{ number_format($bulaninilv3,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv3 + $bulaninilv3,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv3 - ($bulanlalulv3 + $bulaninilv3),2,',','.') }}</td>
                        <td>{{ $targetakhirlv3 == 0 ? 0 : (int)((($targetakhirlv3 - ($bulanlalulv3 + $bulaninilv3)) / $targetakhirlv3) * 100) }} %</td>
                    </tr>
                @endif

                {{-- level-4 --}}
                @if ($rek->idlevel4 && ($rek->idlevel4 !== $idlevel4))
                    @php
                        $targetlv4 = 0;
                        $targetakhirlv4 = 0;
                        $bulanlalulv4 = 0;
                        $bulaninilv4 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel4 == $rek->idlevel4){
                                $targetlv4 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgakhir) {
                            if($tgakhir->idlevel4 == $rek->idlevel4){
                                $targetakhirlv4 += $tgakhir->jumlahpendapatan;
                            }
                        }

                        foreach ($data as $dt) {
                            if($dt->idlevel4 == $rek->idlevel4){
                                $bulanlalulv4 += $dt->total_bku_bulan_lalu;
                                $bulaninilv4 += $dt->total_bku_bulan_ini;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $rek->koderekeninglevel4 }}</td>
                        <td>{{ $rek->namarekeninglevel4 }}</td>
                        <td>{{ number_format($targetlv4,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv4,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv4,2,',','.') }}</td>
                        <td>{{ number_format($bulaninilv4,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv4 + $bulaninilv4,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv4 - ($bulanlalulv4 + $bulaninilv4),2,',','.') }}</td>
                        <td>{{ $targetakhirlv4 == 0 ? 0 : (int)((($targetakhirlv4 - ($bulanlalulv4 + $bulaninilv4)) / $targetakhirlv4) * 100) }} %</td>
                    </tr>
                @endif

                {{-- level-5 --}}
                @if ($rek->idlevel5 && ($rek->idlevel5 !== $idlevel5))
                    @php
                        $targetlv5 = 0;
                        $targetakhirlv5 = 0;
                        $bulanlalulv5 = 0;
                        $bulaninilv5 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel5 == $rek->idlevel5){
                                $targetlv5 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgakhir) {
                            if($tgakhir->idlevel5 == $rek->idlevel5){
                                $targetakhirlv5 += $tgakhir->jumlahpendapatan;
                            }
                        }

                        foreach ($data as $dt) {
                            if($dt->idlevel5 == $rek->idlevel5){
                                $bulanlalulv5 += $dt->total_bku_bulan_lalu;
                                $bulaninilv5 += $dt->total_bku_bulan_ini;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $rek->koderekeninglevel5 }}</td>
                        <td>{{ $rek->namarekeninglevel5 }}</td>
                        <td>{{ number_format($targetlv5,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv5,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv5,2,',','.') }}</td>
                        <td>{{ number_format($bulaninilv5,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv5 + $bulaninilv5,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv5 - ($bulanlalulv5 + $bulaninilv5),2,',','.') }}</td>
                        <td>{{ $targetakhirlv5 == 0 ? 0 : (int)((($targetakhirlv5 - ($bulanlalulv5 + $bulaninilv5)) / $targetakhirlv5) * 100) }} %</td>
                    </tr>
                @endif

                {{-- level-6 --}}
                @if ($rek->idlevel6 && ($rek->idlevel6 !== $idlevel6))
                    @php
                        $targetlv6 = 0;
                        $targetakhirlv6 = 0;
                        $bulanlalulv6 = 0;
                        $bulaninilv6 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel6 == $rek->idlevel6){
                                $targetlv6 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgakhir) {
                            if($tgakhir->idlevel6 == $rek->idlevel6){
                                $targetakhirlv6 += $tgakhir->jumlahpendapatan;
                            }
                        }

                        foreach ($data as $dt) {
                            if($dt->idlevel6 == $rek->idlevel6){
                                $bulanlalulv6 += $dt->total_bku_bulan_lalu;
                                $bulaninilv6 += $dt->total_bku_bulan_ini;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $rek->koderekeninglevel6 }}</td>
                        <td>{{ $rek->namarekeninglevel6 }}</td>
                        <td>{{ number_format($targetlv6,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv6,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv6,2,',','.') }}</td>
                        <td>{{ number_format($bulaninilv6,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv6 + $bulaninilv6,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv6 - ($bulanlalulv6 + $bulaninilv6),2,',','.') }}</td>
                        <td>{{ $targetakhirlv6 == 0 ? 0 : (int)((($targetakhirlv6 - ($bulanlalulv6 + $bulaninilv6)) / $targetakhirlv6) * 100) }} %</td>
                    </tr>
                @endif

                {{-- level-7 --}}
                @if ($rek->idlevel7 && ($rek->idlevel7 !== $idlevel7))
                    @php
                        $targetlv7 = 0;
                        $targetakhirlv7 = 0;
                        $bulanlalulv7 = 0;
                        $bulaninilv7 = 0;

                        foreach ($targetawal as $tg) {
                            if($tg->idlevel7 == $rek->idlevel7){
                                $targetlv7 += $tg->jumlahpendapatan;
                            }
                        }

                        foreach ($targetakhir as $tgakhir) {
                            if($tgakhir->idlevel7 == $rek->idlevel7){
                                $targetakhirlv7 += $tgakhir->jumlahpendapatan;
                            }
                        }

                        foreach ($data as $dt) {
                            if($dt->idlevel7 == $rek->idlevel7){
                                $bulanlalulv7 += $dt->total_bku_bulan_lalu;
                                $bulaninilv7 += $dt->total_bku_bulan_ini;
                            }
                        }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel7 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel7 }}</td>
                        <td>{{ number_format($targetlv7,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv7,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv7,2,',','.') }}</td>
                        <td>{{ number_format($bulaninilv7,2,',','.') }}</td>
                        <td>{{ number_format($bulanlalulv7 + $bulaninilv7,2,',','.') }}</td>
                        <td>{{ number_format($targetakhirlv7 - ($bulanlalulv7 + $bulaninilv7),2,',','.') }}</td>
                        <td>{{ $targetakhirlv7 == 0 ? 0 : (int)((($targetakhirlv7 - ($bulanlalulv7 + $bulaninilv7)) / $targetakhirlv7) * 100) }} %</td>
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

                        foreach ($targetakhir as $tgakhir) {
                            if($tgakhir->idrekening == $rek->idrekening){
                                $targetakhirlv8 += $tgakhir->jumlahpendapatan;
                            }
                        }

                        foreach ($data as $dt) {
                            if($dt->idrekening == $rek->idrekening){
                                $bulanlalulv8 += $dt->total_bku_bulan_lalu;
                                $bulaninilv8 += $dt->total_bku_bulan_ini;
                            }
                        }
                    @endphp
                    <td>{{ $rek->koderekening }}</td>
                    <td>{{ $rek->namarekening }}</td>
                    <td>{{ number_format($targetlv8,2,',','.') }}</td>
                    <td>{{ number_format($targetakhirlv8,2,',','.') }}</td>
                    <td>{{ number_format($bulanlalulv8,2,',','.') }}</td>
                    <td>{{ number_format($bulaninilv8,2,',','.') }}</td>
                    <td>{{ number_format($bulanlalulv8 + $bulaninilv8,2,',','.') }}</td>
                    <td>{{ number_format($targetakhirlv8 - ($bulanlalulv8 + $bulaninilv8),2,',','.') }}</td>
                    <td>{{ $targetakhirlv8 == 0 ? 0 : (int)((($targetakhirlv8 - ($bulanlalulv8 + $bulaninilv8)) / $targetakhirlv8) * 100) }} %</td>
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
    <table style="margin-top: 3em;" cellspacing="0" cellpadding="0" border="0" width="100%">
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
    </table>

    <script>
        window.print()
    </script>
</body>

</html>
