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
        size: landscape;   /* auto is the initial value */
        margin: 2cm 2cm 2cm 3cm;  /* this affects the margin in the printer settings */
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
                ANGGARAN KAS {{ strtoupper(substr($tahap[0]->tahap, 0, -3)) }}
                </b><br>
                <b style="font-size: 23px;">
                RS Jiwa GRHASIA DINKES DIY
                </b>
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 1px solid black;">
                <b>Tahun Anggaran {{ $tahun }}
                </b>
            </td>
        </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel">
                <tr>
                    <td align="center" style="padding: 10px; font-weight: bold ">Kode Rekening</td>
                    <td align="center" style="padding: 10px; font-weight: bold; ">Uraian</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Pagu</td>
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
                    <td align="center" style="padding: 10px; font-weight: bold;  ">Sub Total</td>
                </tr>
                @foreach ($data as $dt)
                <tr>
                    @if($dt->bold == 'iya')
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->kode }}</td>
                    <td style="padding: 10px;font-weight:bold;">{{ $dt->keterangan }}</td>
                    @else
                        @if($dt->tkode == 'iya')
                            <td style="padding: 10px;">{{ $dt->kode }}</td>
                            <td style="padding: 10px;">{{ $dt->keterangan }}</td>
                        @else
                            <td style="padding: 10px;"></td>
                            <td style="padding: 10px;">{{ $dt->keterangan }}</td>
                        @endif
                    @endif
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
                    <td style="padding: 10px;">{{ number_format($dt->subtotal,0,',','.') }}</td>
                </tr>
                @endforeach
        </table>
<script>
    window.print()
</script>
</body>
</html>