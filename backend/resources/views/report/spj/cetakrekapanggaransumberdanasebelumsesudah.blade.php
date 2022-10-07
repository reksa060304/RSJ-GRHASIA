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
                {{substr($sebelum[0]->tahapsesudah, 0, -3)}}
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
                    <font style="font-size: 11pt; " color="#000000" face="Arial">
                            <b>REKAP ANGGARAN TIAP SUB KEGIATAN (SUMBERDANA) <br> TAHUN ANGGARAN {{ date('Y') }}</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border: 3px solid black;" class="tabel">
                <tr>
                    <td width="15"  rowspan="2" style="padding: 10px; font-weight: bold ">NO</td>
                    <td width="50" rowspan="2" style="padding: 10px; font-weight: bold; ">KETERANGAN</td>
                    <td colspan="3"style="padding: 10px; text-align: center; font-weight: bold;">ANGGARAN SEBELUM PERUBAHAN</td>
                    <td colspan="3" style="padding: 10px; text-align: center; font-weight: bold;">ANGGARAN SESUDAH PERUBAHAN</td>
                    <td width="20"colspan="3" style="padding: 10px; text-align: center; font-weight: bold;">BERTAMBAH / BERKURANG</td>
                </tr>
                <tr>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">JASA LAYANAN</td>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">APBD</td>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">SUB TOTAL</td>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">JASA LAYANAN</td>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">APBD</td>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">SUB TOTAL</td>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">JASA LAYANAN</td>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">APBD</td>
                    <td width="20" style="padding: 10px; font-weight: bold;  ">SUB TOTAL</td>
                </tr>
                @php
                $sebelumjasalayanan = 0;
                $sebelumapbd = 0;
                $sebelumtotal = 0;
                $sesudahjasalayanan = 0;
                $sesudahapbd = 0;
                $sesudahtotal = 0;
                $berkurang = 0;
                $jasalayananberkurang = 0;
                $apbdberkurang = 0;
                @endphp
                @foreach($sebelum as $sb)
                <tr>
                    @php
                    $sebelumjasalayanan += $sb->jasalayanan;
                    $sebelumapbd += $sb->apbd;
                    $sebelumtotal += $sb->total;
                    $sesudahjasalayanan += $sb->kjasalayanan;
                    $sesudahapbd += $sb->kapbd;
                    $sesudahtotal += $sb->ktotal;
                    $sb->ktotal > $sb->total ? $berkurang += ($sb->ktotal - $sb->total) : $berkurang += ($sb->total - $sb->ktotal);
                    $sb->kjasalayanan > $sb->jasalayanan ? $jasalayananberkurang += ($sb->kjasalayanan - $sb->jasalayanan) : $jasalayananberkurang += ($sb->jasalayanan - $sb->kjasalayanan);
                    $sb->kapbd > $sb->apbd ? $apbdberkurang += ($sb->kapbd - $sb->apbd) : $apbdberkurang += ($sb->apbd - $sb->kapbd);
                    
                    @endphp
                    @if($sb->div == 2)
                    <td width="15" style="padding: 10px; "><b>{{ substr($sb->kode, -4) }}</b></td>
                    @elseif($sb->div == 3)
                    <td width="15" style="padding: 10px; ">{{ substr($sb->kode, -2) }}</td>
                    @endif
                    @if($sb->div == 2)
                    <td width="50" style="padding: 10px;"><b>{{$sb->kegiatan}}</b></td>
                    @elseif($sb->div == 3)
                    <td width="50" style="padding: 10px;">{{$sb->kegiatan}}</td>
                    @endif
                    <td width="20" style="padding: 10px;">{{number_format($sb->jasalayanan,0,',','.')}}</td>
                    <td width="20" style="padding: 10px;">{{number_format($sb->apbd,0,',','.')}}</td>
                    <td width="20" style="padding: 10px;">{{number_format($sb->total,0,',','.')}}</td>
                    <td width="20" style="padding: 10px;">{{number_format($sb->kjasalayanan,0,',','.')}}</td>
                    <td width="20" style="padding: 10px;">{{number_format($sb->kapbd,0,',','.')}}</td>
                    <td width="20" style="padding: 10px;">{{number_format($sb->ktotal,0,',','.')}}</td>
                    @if($sb->kjasalayanan > $sb->jasalayanan)
                    <td width="20" style="padding: 10px;">{{ number_format($sb->kjasalayanan-$sb->jasalayanan,0,',','.') }}</td>
                    @elseif($sb->kjasalayanan < $sb->jasalayanan)
                    <td width="20" style="padding: 10px;">{{ number_format($sb->jasalayanan-$sb->kjasalayanan,0,',','.') }}</td>
                    @else
                    <td width="20" style="padding: 10px;">{{ number_format($sb->jasalayanan+$sb->kjasalayanan,0,',','.') }}</td>
                    @endif

                    @if($sb->kapbd > $sb->apbd)
                    <td width="20" style="padding: 10px;">{{number_format($sb->kapbd - $sb->apbd,0,',','.')}}</td>
                    @elseif($sb->kapbd < $sb->apbd)
                    <td width="20" style="padding: 10px;">{{number_format($sb->apbd - $sb->kapbd,0,',','.')}}</td>
                    @else
                    <td width="20" style="padding: 10px;">{{number_format($sb->apbd+$sb->kapbd,0,',','.')}}</td>
                    @endif

                    @if($sb->ktotal > $sb->total)
                    <td width="20" style="padding: 10px;">{{number_format($sb->ktotal - $sb->total,0,',','.')}}</td>
                    @elseif($sb->ktotal < $sb->total)
                    <td width="20" style="padding: 10px;">{{number_format($sb->total - $sb->ktotal,0,',','.')}}</td>
                    @else
                    <td width="20" style="padding: 10px;">{{number_format($sb->total+$sb->ktotal,0,',','.')}}</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td colspan="2" width="20" style="padding: 10px; font-weight: bold; text-align: center; ">JUMLAH TOTAL</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($sebelumjasalayanan,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($sebelumapbd,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($sebelumtotal,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($sesudahjasalayanan,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($sesudahapbd,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($sesudahtotal,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($jasalayananberkurang,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($apbdberkurang,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($berkurang,0,',','.') }}</td>
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