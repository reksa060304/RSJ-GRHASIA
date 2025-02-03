<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Rekap Total Anggaran </title>

    <style>
        @page {
            size: auto;
            margin: 0.4in 0.4in 0.4in 1in;
            font-family: Arial, Helvetica, sans-serif;
            overflow: hidden;
            font-size: 10pt;
        }
        body{
            font-family: Arial, Helvetica, sans-serif;
        }
        p{
            margin: 0;
        }
        table{
            width: 100%;
        }
        table tbody tr td {
            border: 1px solid black;
        }
        table thead tr th {
            border: 1px solid black;
        }
    </style>

</head>
<body>
    <table cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td rowspan="2" align="center" style="padding: 15px;">
                    @if(stripos(\Request::url(), 'localhost') !== FALSE)
                    <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px" >
                    @else
                    <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px" >
                    @endif
                </td>
                <td align="center" style="padding: 3px;">
                    <b>
                        RENCANA BISNIS DAN ANGGARAN<br>
                        BADAN LAYANAN UMUM DAERAH
                    </b>
                </td>
                <td rowspan="2" align="center" style="padding: 3px;">
                    <b>RBA</b><br>
                    {{substr($itahap[0]->tahap, 0, -3)}}
                </td>
            </tr>
            <tr align="center">
                <td>
                    <b>RS Jiwa GRHASIA<br>TAHUN {{ $tahun }}</b>
                </td>
            </tr>
            <tr >
                <td colspan="3" style="padding: 10px;">
                    <p align="center">
                        <font style="font-size: 12pt; " color="#000000">
                            <b>REKAP TOTAL ANGGARAN <br> TAHUN ANGGARAN {{ $tahun }}</b>
                        </font>
                        <br>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>

    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th align="center" colspan="2" style="padding: 10px; font-weight: bold;">NO</th>
                <th align="center" style="padding: 10px; font-weight: bold;">ALOKASI BIAYA/PENGELUARAN</th>
                <th align="center" style="padding: 10px; font-weight: bold;">SEBELUM PERUBAHAN</th>
                <th align="center" style="padding: 10px; font-weight: bold;">SETELAH PERUBAHAN</th>
                <th align="center" style="padding: 10px; font-weight: bold;">BERTAMBAH / (BERKURANG)</th>
            </tr>
        </thead>
        <tbody>
        
            @php
                $kodeMataAnggaran1 = null;
                $kodeMataAnggaran2 = null;
                $kodeMataAnggaran3 = null;
            @endphp
            
            @foreach ($sebelum as $item)
                @if ($item->kodemataanggaran1 && ($item->kodemataanggaran1 !== $kodeMataAnggaran1))
                    <tr style="font-weight:bold;">
                        @php
                            $totalsebelumMataAnggaran1 = 0;
                            $totalsesudahMataAnggaran1 = 0;

                            foreach($sebelum as $mt1){
                                if($mt1->kodemataanggaran1 == $item->kodemataanggaran1){
                                    $totalsebelumMataAnggaran1 += (float)$mt1->total;
                                    $totalsesudahMataAnggaran1 += (float)$mt1->totalsesudah;
                                }
                            }
                        @endphp

                        <td style="padding:10px;">{{ $item->kodemataanggaran1 }}</td>
                        <td style="padding:10px;"></td>
                        <td style="padding:10px;">{{ $item->namamataanggaran1 }}</td>
                        <td style="padding:10px;">{{ number_format((float)$totalsebelumMataAnggaran1,2,',','.') }}</td>
                        <td style="padding:10px;">{{ number_format((float)$totalsesudahMataAnggaran1,2,',','.') }}</td>
                        <td style="padding:10px;">{{ number_format(((float)$totalsebelumMataAnggaran1 - (float)$totalsesudahMataAnggaran1),2,',','.') }}</td>
                    </tr>
                @endif

                @if ($item->kodemataanggaran2 && ($item->kodemataanggaran2 !== $kodeMataAnggaran2) && $item->kodemataanggaran1 !== 'III')
                    <tr>
                        @php
                            $totalsebelumMataAnggaran2 = 0;
                            $totalsesudahMataAnggaran2 = 0;

                            foreach($sebelum as $mt2){
                                if($mt2->kodemataanggaran2 == $item->kodemataanggaran2){
                                    $totalsebelumMataAnggaran2 += (float)$mt2->total;
                                    $totalsesudahMataAnggaran2 += (float)$mt2->totalsesudah;
                                }
                            }

                            $split_lv2 = explode('.', $item->kodemataanggaran2);
                            $kode_lv2 = end($split_lv2);
                        @endphp

                        <td style="padding:10px;"></td>
                        <td style="padding:10px;">{{ $kode_lv2 }}</td>
                        <td style="padding:10px;">{{ $item->namamataanggaran1 }}</td>
                        <td style="padding:10px;">{{ number_format((float)$totalsebelumMataAnggaran2,2,',','.') }}</td>
                        <td style="padding:10px;">{{ number_format((float)$totalsesudahMataAnggaran2,2,',','.') }}</td>
                        <td style="padding:10px;">{{ number_format(((float)$totalsebelumMataAnggaran2 - (float)$totalsesudahMataAnggaran2),2,',','.') }}</td>
                    </tr>
                @endif
                
                <tr>
                    @php
                        $split = explode('.', $item->kodemataanggaran3);
                        $kode = end($split);
                    @endphp
                    <td style="padding:10px;"></td>
                    <td style="padding:10px;"></td>
                    <td style="padding:10px;">{{ $kode }}. {{ $item->namamataanggaran3 }}</td>
                    <td style="padding:10px;">{{ number_format((float)$item->total,2,',','.') }}</td>
                    <td style="padding:10px;">{{ number_format((float)$item->totalsesudah,2,',','.') }}</td>
                    <td style="padding:10px;">{{ number_format(((float)$item->total - (float)$item->totalsesudah),2,',','.') }}</td>
                </tr>

                @php
                    $kodeMataAnggaran1 = $item->kodemataanggaran1;
                    $kodeMataAnggaran2 = $item->kodemataanggaran2;
                    $kodeMataAnggaran3 = $item->kodemataanggaran2;
                @endphp
            @endforeach

            {{-- row total --}}
            <tr>
                @php
                    $jumlahTotSebelum = 0;
                    $jumlahTotSesudah = 0;

                    foreach($sebelum as $tot){
                        $jumlahTotSebelum += (float)$tot->total;
                        $jumlahTotSesudah += (float)$tot->totalsesudah;
                    }
                @endphp
                <td style="padding:10px; text-align:center;" colspan="3">Jumlah Total</td>
                <td style="padding:10px;">{{ number_format((float)$jumlahTotSebelum,2,',','.') }}</td>
                <td style="padding:10px;">{{ number_format((float)$jumlahTotSesudah,2,',','.') }}</td>
                <td style="padding:10px;">{{ number_format(((float)$jumlahTotSebelum - (float)$jumlahTotSesudah),2,',','.') }}</td>
            </tr>
        </tbody>
                
    </table>

    <table cellpadding="0" cellspacing="0" width="100%">
        <thead>
            <tr>
                <td width="400">
                </td>
                <td>
                </td>
                <td>
                    <p align="center" style="margin-top: 50px;">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Yogyakarta, {{ $tanggalcetak }}
                        </font>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="400">
                </td>
                <td>
                </td>
                <td>
                    <p align="center" style="margin-bottom:50px">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Kepala BLUD RS Jiwa GRHASIA
                        </font>
                    </p>
                </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr>
                <td width="400">
                </td>
                <td>
                </td>
                <td>
                    <p align="center" style="margin-top: 50px;">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                <u>dr. Akhmad Akhadi Syamsudhuha, M.P.H</u>
                        </font>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="400">
                </td>
                <td>
                </td>
                <td>
                    <p align="center">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                        NIP. 19680714 200012 1 002
                        </font>
                    </p>
                </td>
            </tr>
    </table>
</body>
</html>