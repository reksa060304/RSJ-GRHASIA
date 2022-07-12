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
                {{substr($sebelum[0]->tahapsetelah, 0, -3)}}
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 3px solid black;">
                <b>RS Jiwa GRHASIA DINKES DIY<br>TAHUN 2022</b>
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
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border: 3px solid black;">
                <tr>
                    <td align="center"width="20"  colspan="2" style="padding: 10px; font-weight: bold ">NO</td>
                    <td width="200" style="padding: 10px; font-weight: bold;border-left: 3px solid black; ">ALOKASI BIAYA/PENGELUARAN</td>
                    <td width="50" style="padding: 10px; text-align: center; font-weight: bold;border-left: 3px solid black;  ">SEBELUM PERUBAHAN</td>
                    <td width="50" style="padding: 10px; text-align: center; font-weight: bold;border-left: 3px solid black; border-right: 3px solid black;   ">SETELAH PERUBAHAN</td>
                    <td width="20" style="padding: 10px; font-weight: bold ; ">BERTAMBAH / (BERKURANG)</td>
                </tr>
                @php
                $totalsebelum = 0;
                $totalsesudah = 0;
                $totalberkurang = 0;
                @endphp
                <tr>
                    @php
                    $totalsebelum += $jumlah[0]->totalawalsebelum;
                    $totalsesudah += $jumlah[0]->totalawalsesudah;
                    $jumlah[0]->totalawalsebelum > $jumlah[0]->totalawalsesudah ? $totalberkurang += ($jumlah[0]->totalawalsebelum - $jumlah[0]->totalawalsesudah) : $totalberkurang += ($jumlah[0]->totalawalsesudah - $jumlah[0]->totalawalsebelum);
                    @endphp
                    <td width="10" style="padding: 10px; font-weight: bold; border-top: 3px solid black; border-right: 3px solid black;">I</td>
                    <td width="10" style="padding: 10px; font-weight: bold; border-top: 3px solid black; "></td>
                    <td width="200" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black;">BIAYA OPERASIONAL</td>
                    <td width="50" style="padding: 10px; text-align: left; font-weight: bold;border-left: 3px solid black;border-top: 3px solid black;  text-align: right;">{{$jumlah[0]->totalawalsebelum}}</td>
                    <td width="50" style="padding: 10px; text-align: left; font-weight: bold;border-left: 3px solid black;border-right: 3px solid black; border-top: 3px solid black; text-align: right;">{{$jumlah[0]->totalawalsesudah}}</td>
                    @if($jumlah[0]->totalawalsebelum > $jumlah[0]->totalawalsesudah)
                    <td width="20" style="padding: 10px; border-top: 3px solid black; font-weight: bold;text-align: right;">{{$jumlah[0]->totalawalsebelum-$jumlah[0]->totalawalsesudah}}</td>
                    @elseif($jumlah[0]->totalawalsebelum < $jumlah[0]->totalawalsesudah)
                    <td width="20" style="padding: 10px; border-top: 3px solid black; font-weight: bold;text-align: right;">{{$jumlah[0]->totalawalsesudah-$jumlah[0]->totalawalsebelum}}</td>
                    @endif
                </tr>
                @foreach($sebelum as $sb)
                <tr>
                
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    @php
                    $totalsebelum += $sb->subtotalsebelum;
                    $totalsesudah += $sb->subtotalsetelah;
                    $sb->subtotalsebelum > $sb->subtotalsetelah ? $totalberkurang += ($sb->subtotalsebelum - $sb->subtotalsetelah) : $totalberkurang += ($sb->subtotalsetelah - $sb->subtotalsebelum);
                    @endphp
                    <td width="10" style="padding: 10px; font-weight: bold; border-top: 3px solid black; border-right: 3px solid black;">{{$sb->kodemataanggaran}}</td>
                    <td width="10" style="padding: 10px; font-weight: bold; border-top: 3px solid black; "></td>
                    @elseif(strpos($sb->kodemataanggaran,'I.') !== false && strlen($sb->kodemataanggaran) == 3)
                    <td width="10" style="padding: 10px; font-weight: bold; border-top: 3px solid black; border-right: 3px solid black;"></td>
                    <td width="10" style="padding: 10px; font-weight: bold; border-top: 3px solid black; ">{{substr($sb->kodemataanggaran, -1)}}</td>
                    @else
                    <td width="10" style="padding: 10px; font-weight: bold; border-top: 3px solid black; border-right: 3px solid black;"></td>
                    <td width="10" style="padding: 10px; font-weight: bold; border-top: 3px solid black; "></td>
                    @endif                    
                    @if(strlen($sb->kodemataanggaran) > 3)
                    <td width="200" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black;">{{substr($sb->kodemataanggaran, -1)}}. {{$sb->namamataanggaran}}</td>
                    @else
                    <td width="200" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black;">{{$sb->namamataanggaran}}</td>
                    @endif
                    <td width="50" style="padding: 10px; text-align: right; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black;  ">{{$sb->subtotalsebelum}}</td>
                    <td width="50" style="padding: 10px; text-align: right; font-weight: bold;border-left: 3px solid black;border-right: 3px solid black; border-top: 3px solid black; ">{{$sb->subtotalsetelah}}</td>
                    @if($sb->subtotalsebelum > $sb->subtotalsetelah)
                    <td width="20" style="padding: 10px; border-top: 3px solid black; text-align: right; font-weight: bold;border-top: 3px solid black;">{{$sb->subtotalsebelum-$sb->subtotalsetelah}}</td>
                    @elseif($sb->subtotalsebelum < $sb->subtotalsetelah)
                    <td width="20" style="padding: 10px; border-top: 3px solid black; text-align: right; font-weight: bold;border-top: 3px solid black;">{{$sb->subtotalsetelah-$sb->subtotalsebelum}}</td>
                    @else
                    <td width="20" style="padding: 10px; border-top: 3px solid black; text-align: right; font-weight: bold;border-top: 3px solid black;"></td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td  colspan="3"  style="padding: 10px; text-align: left; font-weight: bold; border-top: 3px solid black; text-align:center;">JUMLAH TOTAL</td>
                    <td style="padding: 10px; border-top: 3px solid black; font-weight: bold;border-top: 3px solid black;border-left: 3px solid black;text-align: right;">{{$totalsebelum}}</td>
                    <td style="padding: 10px; border-top: 3px solid black; font-weight: bold;border-top: 3px solid black; border-left: 3px solid black;text-align: right;border-right: 3px solid black;">{{$totalsesudah}}</td>
                    <td style="padding: 10px; border-top: 3px solid black; font-weight: bold;border-top: 3px solid black; text-align: right;">{{$totalberkurang}}</td>
                </tr>
                
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 150px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Mengetahui,
                            </font>
                        </p>
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 150px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Yogyakarta, {{ date('d M Y') }}
                            </font>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-bottom:50px">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Kepala Dinas Kesehatan DIY
                            </font>
                        </p>
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-bottom:50px">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Kepala BLUD RS Jiwa GRHASIA DINKES DIY
                            </font>
                        </p>
                    </td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    drg. Pembajun Setyaningastutie, M.Kes
                            </font>
                        </p>
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
                    <td>
                        <p align="center" style="margin-right: 30px; ">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                            NIP. 19650912 199303 2 006
                            </font>
                        </p>
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