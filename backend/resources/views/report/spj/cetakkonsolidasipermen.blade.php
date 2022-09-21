<html>
<head>
    <title>
        Report
    </title>
        @if(stripos(\Request::url(), 'localhost') !== FALSE)
         <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        @else
         <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
        @endif
 
</head>
<style type="text/css" media="print">
    @page {
        size: auto;   /* auto is the initial value */
        margin: 5;  /* this affects the margin in the printer settings */
    }
</style>
<style>

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }

    .tabel tr td{
        border: 1px solid black;
        
    }

    .tabel td{
        width: 50px;
        word-break: break-all;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;
    }

    div.outer {
        position: relative;
    }
    div.inner {
        overflow: hidden;
        white-space: nowrap;
        position: absolute;
        width: 100%;
    }

    /* table, tr, td{
        border: 1px solid black;
    } */
</style>
<body style="background-color: #CCCCCC;">
    <table class="bayangprint" bgcolor="#FFFFFF" width="{{$pageWidth}}" style="border-left: 1px solid black; border-right: 1px solid black; border-top: 1px solid black;">
        <tbody >
        <tr>
            <td align="center" rowspan="2" width="15%"  style="padding: 5px; border-right: 1px solid black;" align="center">
                    <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/logo_grhasia.png') }}" style="width: 120px" >
                            @else
                              <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 120px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" width="85%">
                <b style="font-size: 25px;">
                KONSOLIDASI RBA-BLUD KE REKENING SIPD PERMENDAGRI
                </b>
            </td>
        </tr>
        <tr align="left">
            <td style="border-top: 1px solid black;">
                <b>&emsp;&emsp;SUB KEGIATAN &emsp;&emsp;&emsp;&emsp;: {{ $subkegiatan[0]->kode.' - '.$subkegiatan[0]->keterangan }}<br>
                &emsp;&emsp;ORGANISASI &emsp;&emsp;&emsp;&emsp;&emsp;: 1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY <br>
                &emsp;&emsp;TAHUN ANGGARAN &emsp;&emsp;: {{ $tahun.' - '.substr($tahap[0]->tahap, 0, -3) }}
                </b>
            </td>
        </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel">
                <tr>
                    <td align="center" style="padding: 10px; font-weight: bold ">Kode Rekening</td>
                    <td align="center" style="padding: 10px; font-weight: bold; ">Nama Rekening</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Jumlah Anggaran</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Jan</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">Feb</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Mar</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Apr</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">Mei</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Jun</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Jul</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">Agu</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Sep</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Okt</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">Nov</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Des</td>
                </tr>
                @php
                    $totalanggaran = 0;
                    $totaljan = 0;
                    $totalfeb = 0;
                    $totalmar = 0;
                    $totalapr = 0;
                    $totalmei = 0;
                    $totaljun = 0;
                    $totaljul = 0;
                    $totalagt = 0;
                    $totalsep = 0;
                    $totalokt = 0;
                    $totalnov = 0;
                    $totaldes = 0;
                @endphp
                @foreach ($data as $dt)
                @php
                    $totalanggaran += $dt->jumlahanggaran;
                    $totaljan += $dt->jumlahjan;
                    $totalfeb += $dt->jumlahfeb;
                    $totalmar += $dt->jumlahmar;
                    $totalapr += $dt->jumlahapr;
                    $totalmei += $dt->jumlahmei;
                    $totaljun += $dt->jumlahjun;
                    $totaljul += $dt->jumlahjul;
                    $totalagt += $dt->jumlahagt;
                    $totalsep += $dt->jumlahsep;
                    $totalokt += $dt->jumlahokt;
                    $totalnov += $dt->jumlahnov;
                    $totaldes += $dt->jumlahdes;
                @endphp
                <tr>
                    <td style="padding: 10px;">{{ $dt->kodemataanggaran }}</td>
                    <td style="padding: 10px;">{{ $dt->namamataanggaran }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahanggaran,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahjan,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahfeb,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahmar,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahapr,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahmei,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahjun,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahjul,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahagt,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahsep,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahokt,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahnov,0,',','.') }}</td>
                    <td style="padding: 10px;">{{ number_format($dt->jumlahdes,0,',','.') }}</td>
                </tr>
                @endforeach
                <tr>
                    <td colspan="2" align="center" style="padding: 10px; font-weight: bold ">Jumlah Total Anggaran</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalanggaran,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totaljan,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalfeb,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalmar,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalapr,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalmei,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totaljun,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totaljul,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalagt,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalsep,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalokt,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totalnov,0,',','.') }}</td>
                    <td align="center" style="padding: 10px;">{{ number_format($totaldes,0,',','.') }}</td>
                </tr>
        </table>
<script>
    window.print()
</script>
</body>
</html>