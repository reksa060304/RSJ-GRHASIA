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
            margin: 10;  /* this affects the margin in the printer settings */
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

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }

    textarea {
        border: none;
        outline: none;
        resize: none;
        font-family: Arial;
    }

    /* table, tr, td{
        border: 1px solid black;
    } */
</style>
<body style="background-color: #CCCCCC;">
<div align="center" >
    <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border-left: 3px solid black; border-right: 3px solid black; border-top: 3px solid black;">
        <tbody >
        <tr>
            <td rowspan="2"  style="padding: 5px; width: 50px; border-right: 3px solid black;" align="center">
                    <p align="left">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/logo_grhasia.png') }}" style="width: 120px" >
                            @else
                              <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 120px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" style="width: 300px;">
                <b style="font-size: 25px;">
                    BADAN LAYANAN UMUM DAERAH
                </b>
            </td>
            <td rowspan="2"  align="center" style="width: 150px; border-left: 3px solid black; border-right: 3px solid black;">
                <b style="font-size: 25px;">
                    
                </b><br>
                
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 3px solid black;">
                <b>RS Jiwa GRHASIA</b>
            </td>
        </tr>
        <tr >
        <td colspan="3" style="border-top: 3px solid black; border-right: 3px solid black;">
                <p align="left" style="margin-top: 10px; margin-bottom:10px; margin-left:10px">
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Urusan Pemerintahan &emsp;&emsp; : 
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Organisasi &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; : 
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Waktu Pelaksanaan &emsp;&emsp;&emsp;&nbsp;: 
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Lokasi Kegiatan &emsp;&emsp;&emsp;&emsp;&emsp;: 
                    </font>
                </p>
            </td>
        </tr>
        <tr >
            <td colspan="3" style="border-top: 3px solid black; border-right: 3px solid black;">
                <p align="center" style="margin-top: 10px; margin-bottom:10px">
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            <b>PENDAPATAN OPERASIONAL BLUD TAHUN ANGGARAN</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
        <table class="tabel" width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border: 3px solid black;">
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ">No.</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ">Uraian Pendapatan</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ">Jumlah</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ">Keterangan</td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ">1</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ">2</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ">3</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ">4</td>
                </tr>
                @php
                    $no = 0;
                    $total = 0;
                @endphp
                @foreach($data as $dt)
                <tr>
                    @if($dt->bold == 'iya' || $dt->bold == 'juga')
                    @php
                        $no++;
                        $total += $dt->jumlah;
                    @endphp
                            <td align="center" width="50" style="padding: 10px; font-weight: bold ">{{ $no }}</td>
                            <td align="left" width="50" style="padding: 10px; font-weight: bold ">{{ $dt->namaexternal }}</td>
                            <td align="right" width="50" style="padding: 10px; font-weight: bold ">{{ number_format($dt->jumlah,0,',','.') }}</td>
                            <td align="left" width="50" style="padding: 10px; font-weight: bold ">{{ $dt->keterangan }}</td>
                    @else
                    <td align="center" width="50" style="padding: 10px;"></td>
                    <td align="left" width="50" style="padding: 10px;">{{ $dt->namaexternal }}</td>
                    <td align="right" width="50" style="padding: 10px;">{{ number_format($dt->jumlah,0,',','.') }}</td>
                    <td align="left" width="50" style="padding: 10px;">{{ $dt->keterangan }}</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td align="center" width="50" colspan="2" style="padding: 10px; font-weight: bold ">JUMLAH TOTAL PENDAPATAN</td>
                    <td align="right" width="50" style="padding: 10px; font-weight: bold ">{{ number_format($total,0,',','.') }}</td>
                    <td align="left" width="50" style="padding: 10px; font-weight: bold "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td width="300">
                    </td>
                    <td width="300">
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Yogyakarta, {{ $tanggalcetak }}
                            </font>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td width="300">
                    </td>
                    <td width="300">
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-bottom:50px">
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
                    <td width="300">
                    </td>
                    <td width="300">
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    dr. Akhmad Akhadi Syamsudhuha, M.P.H
                            </font>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td width="300">
                    </td>
                    <td width="300">
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; ">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                            NIP. 19680714 200012 1 002
                            </font>
                        </p>
                    </td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>