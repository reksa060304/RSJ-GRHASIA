<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>SPJ Bulanan Fungsional Bendahara Penerimaan</title>
    
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
            <td>SURI HERLINA PRATIWI, S.KM, M.PH</td>
        </tr>
        <tr>
            <td>Tahun Anggaran</td>
            <td>:</td>
            <td>{{ $tahun }}</td>
        </tr>
        
    </table>

    <table id="table-spjbp" cellspacing="0" cellpadding="0" width="100%">
        <thead>
            <tr>
                <th rowspan="2">Kode Rekening</th>
                <th rowspan="2">Uraian</th>
                <th rowspan="2">TARGET PENDAPATAN {{$tahun}}</th>
                <th colspan="13">Penerimaan</th>
                <th rowspan="2">Sisa Target Pendapatan</th>
            </tr>
            <tr>
                <th>Januari</th>
                <th>Februari</th>
                <th>Maret</th>
                <th>April</th>
                <th>Mei</th>
                <th>Juni</th>
                <th>Juli</th>
                <th>Agustus</th>
                <th>September</th>
                <th>Oktober</th>
                <th>November</th>
                <th>Desember</th>
                <th>s.d. Bulan ini</th>
            </tr>
            <tr>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>8</th>
                <th>9</th>
                <th>10</th>
                <th>11</th>
                <th>12</th>
                <th>13</th>
                <th>14</th>
                <th>15</th>
                <th>16(4sd15)</th>
                <th>17</th>
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

                            foreach ($target as $tg) {
                                if($tg->idlevel1 == $rek->idlevel1){
                                    $targetlv1 += $tg->jumlahpendapatan;
                                }
                            }

                            // foreach ($data as $dt) {
                            //     if($dt->idlevel1 == $rek->idlevel1){
                            //         $bulanlalulv1 += $dt->total_bku_bulan_lalu;
                            //         $bulaninilv1 += $dt->total_bku_bulan_ini;
                            //     }
                            // }
                        @endphp
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel1 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel1 }}</td>
                        <td>{{ number_format($targetlv1,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv1 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahMaretLv1 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAprilLv1 = 0;
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahAprilLv1 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAprilLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv1 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel1 == $rek->idlevel1){
                                        $jumlahDesemberLv1 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv1,2,',','.') }}
                        </td>

                        <td>
                            @php
                                $jumlahLv1 = $jumlahJanuariLv1 + $jumlahFebruariLv1 + $jumlahMaretLv1 + $jumlahAprilLv1 + $jumlahMeiLv1 + $jumlahJuniLv1 + $jumlahJuliLv1 + $jumlahAgustusLv1 + $jumlahSeptemberLv1 + $jumlahOktoberLv1 + $jumlahNovemberLv1 + $jumlahDesemberLv1;
                            @endphp
                            {{ number_format($jumlahLv1,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $selisihLv1 = $targetlv1 - $jumlahLv1;
                            @endphp
                            {{ number_format($selisihLv1,2,',','.') }}
                        </td>
                    </tr>
                @endif

                {{-- level-2 --}}
                @if ($rek->idlevel2 && ($rek->idlevel2 !== $idlevel2))
                    @php
                        $targetlv2 = 0;
                        $targetakhirlv2 = 0;
                        $bulanlalulv2 = 0;
                        $bulaninilv2 = 0;

                        foreach ($target as $tg) {
                            if($tg->idlevel2 == $rek->idlevel2){
                                $targetlv2 += $tg->jumlahpendapatan;
                            }
                        }

                        // foreach ($data as $dt) {
                        //     if($dt->idlevel2 == $rek->idlevel2){
                        //         $bulanlalulv2 += $dt->total_bku_bulan_lalu;
                        //         $bulaninilv2 += $dt->total_bku_bulan_ini;
                        //     }
                        // }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel2 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel2 }}</td>
                        <td>{{ number_format($targetlv2,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv2 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahMaretLv2 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAprilLv2 = 0;
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahAprilLv2 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAprilLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv2 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel2 == $rek->idlevel2){
                                        $jumlahDesemberLv2 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv2,2,',','.') }}
                        </td>

                        <td>
                            @php
                                $jumlahLv2 = $jumlahJanuariLv2 + $jumlahFebruariLv2 + $jumlahMaretLv2 + $jumlahAprilLv2 + $jumlahMeiLv2 + $jumlahJuniLv2 + $jumlahJuliLv2 + $jumlahAgustusLv2 + $jumlahSeptemberLv2 + $jumlahOktoberLv2 + $jumlahNovemberLv2 + $jumlahDesemberLv2;
                            @endphp
                            {{ number_format($jumlahLv2,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $selisihLv2 = $targetlv2 - $jumlahLv2;
                            @endphp
                            {{ number_format($selisihLv2,2,',','.') }}
                        </td>
                    </tr>
                @endif

                {{-- level-3 --}}
                @if ($rek->idlevel3 && ($rek->idlevel3 !== $idlevel3))
                    @php
                        $targetlv3 = 0;
                        $targetakhirlv3 = 0;
                        $bulanlalulv3 = 0;
                        $bulaninilv3 = 0;

                        foreach ($target as $tg) {
                            if($tg->idlevel3 == $rek->idlevel3){
                                $targetlv3 += $tg->jumlahpendapatan;
                            }
                        }

                        // foreach ($data as $dt) {
                        //     if($dt->idlevel3 == $rek->idlevel3){
                        //         $bulanlalulv3 += $dt->total_bku_bulan_lalu;
                        //         $bulaninilv3 += $dt->total_bku_bulan_ini;
                        //     }
                        // }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel3 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel3 }}</td>
                        <td>{{ number_format($targetlv3,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv3 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahMaretLv3 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAprilLv3 = 0;
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahAprilLv3 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAprilLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv3 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel3 == $rek->idlevel3){
                                        $jumlahDesemberLv3 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv3,2,',','.') }}
                        </td>

                        <td>
                            @php
                                $jumlahLv3 = $jumlahJanuariLv3 + $jumlahFebruariLv3 + $jumlahMaretLv3 + $jumlahAprilLv3 + $jumlahMeiLv3 + $jumlahJuniLv3 + $jumlahJuliLv3 + $jumlahAgustusLv3 + $jumlahSeptemberLv3 + $jumlahOktoberLv3 + $jumlahNovemberLv3 + $jumlahDesemberLv3;
                            @endphp
                            {{ number_format($jumlahLv3,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $selisihLv3 = $targetlv3 - $jumlahLv3;
                            @endphp
                            {{ number_format($selisihLv3,2,',','.') }}
                        </td>
                    </tr>
                @endif

                {{-- level-4 --}}
                @if ($rek->idlevel4 && ($rek->idlevel4 !== $idlevel4))
                    @php
                        $targetlv4 = 0;
                        $targetakhirlv4 = 0;
                        $bulanlalulv4 = 0;
                        $bulaninilv4 = 0;

                        foreach ($target as $tg) {
                            if($tg->idlevel4 == $rek->idlevel4){
                                $targetlv4 += $tg->jumlahpendapatan;
                            }
                        }

                        // foreach ($data as $dt) {
                        //     if($dt->idlevel4 == $rek->idlevel4){
                        //         $bulanlalulv4 += $dt->total_bku_bulan_lalu;
                        //         $bulaninilv4 += $dt->total_bku_bulan_ini;
                        //     }
                        // }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel4 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel4 }}</td>
                        <td>{{ number_format($targetlv4,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv4 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahMaretLv4 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAprilLv4 = 0;
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahAprilLv4 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAprilLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv4 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel4 == $rek->idlevel4){
                                        $jumlahDesemberLv4 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv4,2,',','.') }}
                        </td>

                        <td>
                            @php
                                $jumlahLv4 = $jumlahJanuariLv4 + $jumlahFebruariLv4 + $jumlahMaretLv4 + $jumlahAprilLv4 + $jumlahMeiLv4 + $jumlahJuniLv4 + $jumlahJuliLv4 + $jumlahAgustusLv4 + $jumlahSeptemberLv4 + $jumlahOktoberLv4 + $jumlahNovemberLv4 + $jumlahDesemberLv4;
                            @endphp
                            {{ number_format($jumlahLv4,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $selisihLv4 = $targetlv4 - $jumlahLv4;
                            @endphp
                            {{ number_format($selisihLv4,2,',','.') }}
                        </td>
                    </tr>
                @endif

                {{-- level-5 --}}
                @if ($rek->idlevel5 && ($rek->idlevel5 !== $idlevel5))
                    @php
                        $targetlv5 = 0;
                        $targetakhirlv5 = 0;
                        $bulanlalulv5 = 0;
                        $bulaninilv5 = 0;

                        foreach ($target as $tg) {
                            if($tg->idlevel5 == $rek->idlevel5){
                                $targetlv5 += $tg->jumlahpendapatan;
                            }
                        }

                        // foreach ($data as $dt) {
                        //     if($dt->idlevel5 == $rek->idlevel5){
                        //         $bulanlalulv5 += $dt->total_bku_bulan_lalu;
                        //         $bulaninilv5 += $dt->total_bku_bulan_ini;
                        //     }
                        // }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel5 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel5 }}</td>
                        <td>{{ number_format($targetlv5,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv5 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahMaretLv5 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAprilLv5 = 0;
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahAprilLv5 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAprilLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv5 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel5 == $rek->idlevel5){
                                        $jumlahDesemberLv5 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv5,2,',','.') }}
                        </td>

                        <td>
                            @php
                                $jumlahLv5 = $jumlahJanuariLv5 + $jumlahFebruariLv5 + $jumlahMaretLv5 + $jumlahAprilLv5 + $jumlahMeiLv5 + $jumlahJuniLv5 + $jumlahJuliLv5 + $jumlahAgustusLv5 + $jumlahSeptemberLv5 + $jumlahOktoberLv5 + $jumlahNovemberLv5 + $jumlahDesemberLv5;
                            @endphp
                            {{ number_format($jumlahLv5,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $selisihLv5 = $targetlv5 - $jumlahLv5;
                            @endphp
                            {{ number_format($selisihLv5,2,',','.') }}
                        </td>
                    </tr>
                @endif

                {{-- level-6 --}}
                @if ($rek->idlevel6 && ($rek->idlevel6 !== $idlevel6))
                    @php
                        $targetlv6 = 0;
                        $targetakhirlv6 = 0;
                        $bulanlalulv6 = 0;
                        $bulaninilv6 = 0;

                        foreach ($target as $tg) {
                            if($tg->idlevel6 == $rek->idlevel6){
                                $targetlv6 += $tg->jumlahpendapatan;
                            }
                        }

                        // foreach ($data as $dt) {
                        //     if($dt->idlevel6 == $rek->idlevel6){
                        //         $bulanlalulv6 += $dt->total_bku_bulan_lalu;
                        //         $bulaninilv6 += $dt->total_bku_bulan_ini;
                        //     }
                        // }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;">{{ $rek->koderekeninglevel6 }}</td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel6 }}</td>
                        <td>{{ number_format($targetlv6,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv6 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahMaretLv6 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAprilLv6 = 0;
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahAprilLv6 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAprilLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv6 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel6 == $rek->idlevel6){
                                        $jumlahDesemberLv6 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv6,2,',','.') }}
                        </td>

                        <td>
                            @php
                                $jumlahLv6 = $jumlahJanuariLv6 + $jumlahFebruariLv6 + $jumlahMaretLv6 + $jumlahAprilLv6 + $jumlahMeiLv6 + $jumlahJuniLv6 + $jumlahJuliLv6 + $jumlahAgustusLv6 + $jumlahSeptemberLv6 + $jumlahOktoberLv6 + $jumlahNovemberLv6 + $jumlahDesemberLv6;
                            @endphp
                            {{ number_format($jumlahLv6,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $selisihLv6 = $targetlv6 - $jumlahLv6;
                            @endphp
                            {{ number_format($selisihLv6,2,',','.') }}
                        </td>
                    </tr>
                @endif

                {{-- level-7 --}}
                @if ($rek->idlevel7 && ($rek->idlevel7 !== $idlevel7) && str_contains($rek->koderekeninglevel4, '4.1.02.01'))
                    @php
                        $targetlv7 = 0;
                        $targetakhirlv7 = 0;
                        $bulanlalulv7 = 0;
                        $bulaninilv7 = 0;

                        foreach ($target as $tg) {
                            if($tg->idlevel7 == $rek->idlevel7){
                                $targetlv7 += $tg->jumlahpendapatan;
                            }
                        }

                        // foreach ($data as $dt) {
                        //     if($dt->idlevel7 == $rek->idlevel7){
                        //         $bulanlalulv7 += $dt->total_bku_bulan_lalu;
                        //         $bulaninilv7 += $dt->total_bku_bulan_ini;
                        //     }
                        // }
                    @endphp
                    <tr>
                        <td style="font-weight:bold;"></td>
                        <td style="font-weight:bold;">{{ $rek->namarekeninglevel7 }}</td>
                        <td>{{ number_format($targetlv7,2,',','.') }}</td>
                        <td>
                            @php
                                $jumlahJanuariLv7 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahMaretLv7 += $row->maret;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahMaretLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahAprilLv7 = 0;
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahAprilLv7 += $row->april;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahAprilLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $jumlahMeiLv7 = 0;
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
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
                                foreach ($data as $keytga => $row) {
                                    if($row->idlevel7 == $rek->idlevel7){
                                        $jumlahDesemberLv7 += $row->desember;
                                    }
                                }
                            @endphp
                            {{ number_format($jumlahDesemberLv7,2,',','.') }}
                        </td>

                        <td>
                            @php
                                $jumlahLv7 = $jumlahJanuariLv7 + $jumlahFebruariLv7 + $jumlahMaretLv7 + $jumlahAprilLv7 + $jumlahMeiLv7 + $jumlahJuniLv7 + $jumlahJuliLv7 + $jumlahAgustusLv7 + $jumlahSeptemberLv7 + $jumlahOktoberLv7 + $jumlahNovemberLv7 + $jumlahDesemberLv7;
                            @endphp
                            {{ number_format($jumlahLv7,2,',','.') }}
                        </td>
                        <td>
                            @php
                                $selisihLv7 = $targetlv7 - $jumlahLv7;
                            @endphp
                            {{ number_format($selisihLv7,2,',','.') }}
                        </td>
                    </tr>
                @endif

                <tr>
                    @php
                        $targetlv8 = 0;
                        $targetakhirlv8 = 0;
                        $bulanlalulv8 = 0;
                        $bulaninilv8 = 0;

                        foreach ($target as $tg) {
                            if($tg->idrekening == $rek->idrekening){
                                $targetlv8 += $tg->jumlahpendapatan;
                            }
                        }

                        // foreach ($data as $dt) {
                        //     if($dt->idrekening == $rek->idrekening){
                        //         $bulanlalulv8 += $dt->total_bku_bulan_lalu;
                        //         $bulaninilv8 += $dt->total_bku_bulan_ini;
                        //     }
                        // }
                    @endphp
                    <td></td>
                    <td>{{ $rek->namarekening }}</td>
                    <td>{{ number_format($targetlv8,2,',','.') }}</td>
                    <td>
                        @php
                            $jumlahJanuariLv8 = 0;
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahMaretLv8 += $row->maret;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahMaretLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahAprilLv8 = 0;
                            foreach ($data as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahAprilLv8 += $row->april;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahAprilLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $jumlahMeiLv8 = 0;
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
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
                            foreach ($data as $keytga => $row) {
                                if($row->idrekening == $rek->idrekening){
                                    $jumlahDesemberLv8 += $row->desember;
                                }
                            }
                        @endphp
                        {{ number_format($jumlahDesemberLv8,2,',','.') }}
                    </td>
                    
                    <td>
                        @php
                            $jumlahLv8 = $jumlahJanuariLv8 + $jumlahFebruariLv8 + $jumlahMaretLv8 + $jumlahAprilLv8 + $jumlahMeiLv8 + $jumlahJuniLv8 + $jumlahJuliLv8 + $jumlahAgustusLv8 + $jumlahSeptemberLv8 + $jumlahOktoberLv8 + $jumlahNovemberLv8 + $jumlahDesemberLv8;
                        @endphp
                        {{ number_format($jumlahLv8,2,',','.') }}
                    </td>
                    <td>
                        @php
                            $selisihLv8 = $targetlv8 - $jumlahLv8;
                        @endphp
                        {{ number_format($selisihLv8,2,',','.') }}
                    </td>
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
