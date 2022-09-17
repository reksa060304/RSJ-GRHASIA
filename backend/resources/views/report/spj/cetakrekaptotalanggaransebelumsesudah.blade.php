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

    .tabel {
        width: 100%;
        border-collapse: collapse;

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
                    RENCANA BISNIS DAN ANGGARAN<br>
                    BADAN LAYANAN UMUM DAERAH
                </b>
            </td>
            <td rowspan="2"  align="center" style="width: 150px; border-left: 3px solid black;">
                <b style="font-size: 25px;">
                    RBA
                </b><br>
                {{substr($itahap[0]->tahap, 0, -3)}}
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 3px solid black;">
                <b>RS Jiwa GRHASIA<br>TAHUN 2022</b>
            </td>
        </tr>
        <tr >
            <td colspan="3" style="border-top: 3px solid black;">
                <p align="center" style="margin-top: 10px; margin-bottom:10px">
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ date('Y') }}</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border: 3px solid black;" class="tabel">
                <tr>
                    <td align="center"width="20"  colspan="2" style="padding: 10px; font-weight: bold ">NO</td>
                    <td width="200" style="padding: 10px; font-weight: bold; ">ALOKASI BIAYA/PENGELUARAN</td>
                    <td width="50" style="padding: 10px; text-align: center; font-weight: bold;  ">SEBELUM PERUBAHAN</td>
                    <td width="50" style="padding: 10px; text-align: center; font-weight: bold; ">SETELAH PERUBAHAN</td>
                    <td width="20" style="padding: 10px; font-weight: bold ; ">BERTAMBAH / (BERKURANG)</td>
                </tr>
                @php
                $totalsebelum = 0;
                $totalsetelah = 0;
                $totalberkurang = 0;
                @endphp
                <tr>
                    @php
                    $totalsebelum += $jumlah[0]->totalawalsebelum;
                    $totalsetelah += $jumlah[0]->totalawalsetelah;
                    $totalberkurang += ($jumlah[0]->totalawalsetelah - $jumlah[0]->totalawalsebelum);
                    @endphp
                    <td style="padding: 10px; font-weight: bold; ">I</td>
                    <td style="padding: 10px; font-weight: bold; "></td>
                    <td style="padding: 10px; font-weight: bold;"> BIAYA OPERASIONAL</td>
                    <td style="padding: 10px; text-align: left; font-weight: bold; text-align: right;">{{ number_format($jumlah[0]->totalawalsebelum,0,',','.') }}</td>
                    <td style="padding: 10px; text-align: left; font-weight: bold; text-align: right;">{{ number_format($jumlah[0]->totalawalsetelah,0,',','.') }}</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($jumlah[0]->totalawalsetelah - $jumlah[0]->totalawalsebelum,0,',','.') }}</td>
                </tr>
                @foreach($sebelum as $sb)
                <tr>
                
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    @php
                    $totalsebelum += $sb->subtotal;
                    $totalberkurang += $sb->subtotal
                    @endphp
                    <td  style="padding: 10px; font-weight: bold;">{{$sb->kodemataanggaran}}</td>
                    <td  style="padding: 10px; font-weight: bold; "></td>
                    @elseif(strpos($sb->kodemataanggaran,'I.') !== false && strlen($sb->kodemataanggaran) == 3)
                    <td  style="padding: 10px;"></td>
                    <td  style="padding: 10px;">{{substr($sb->kodemataanggaran, -1)}}</td>
                    @else
                    <td  style="padding: 10px;"></td>
                    <td  style="padding: 10px; "></td>
                    @endif                    
                    @if(strlen($sb->kodemataanggaran) > 3)
                    <td  style="padding: 10px; ">{{substr($sb->kodemataanggaran, -1)}}. {{$sb->namamataanggaran}}</td>
                    @else
                        @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                            <td  style="padding: 10px; font-weight: bold;">{{$sb->namamataanggaran}}</td>
                        @else
                            <td  style="padding: 10px; ">{{$sb->namamataanggaran}}</td>
                        @endif
                    @endif
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                        <td  style="padding: 10px; text-align: right; font-weight: bold;   ">{{ number_format($sb->subtotal,0,',','.') }}</td>
                    @else
                        <td style="padding: 10px; text-align: right;    ">{{ number_format($sb->subtotal,0,',','.') }}</td>
                    @endif
                    
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                        <td style="padding: 10px;  text-align: right; font-weight: bold;">{{ number_format($sb->subtotalsetelah,0,',','.') }}</td>
                    @else 
                        <td style="padding: 10px;  text-align: right; ">{{ number_format($sb->subtotalsetelah,0,',','.') }}</td>
                    @endif

                    <td style="padding: 10px; text-align: right; font-weight: bold; ">{{ number_format($sb->subtotalsetelah - $sb->subtotal,0,',','.') }}</td>
                </tr>
                @endforeach
                <tr>
                    <td  colspan="3"  style="padding: 10px; text-align: left; font-weight: bold;  text-align:center;">JUMLAH TOTAL</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totalsebelum,0,',','.') }}</td>
                    <td style="padding: 10px; font-weight: bold; text-align: right; ">{{ number_format($totalsetelah,0,',','.') }}</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totalberkurang,0,',','.') }}</td>
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
                                    Yogyakarta, {{ date('d M Y') }}
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