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
        border-bottom: 3px solid black;
    }

    body {
        font-family: Arial;
    }

    .tabel tr td {
        border: 3px solid black;
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
    <table class="bayangprint" bgcolor="#FFFFFF" width="{{$pageWidth}}" style="border-left: 3px solid black; border-right: 3px solid black; border-top: 3px solid black;">
        <tbody >
        <tr>
            <td rowspan="2"  style="padding: 5px; width: 50px; border-right: 3px solid black;" align="center">
                    <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/logo_grhasia.png') }}" style="width: 120px" >
                            @else
                              <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 120px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" style="width: 200px;">
                <b style="font-size: 25px;">
                    RENCANA BISNIS DAN ANGGARAN<br>
                    BADAN LAYANAN UMUM DAERAH
                </b>
            </td>
            <td rowspan="2"  align="center" style="width: 150px; border-left: 3px solid black;">
                <b style="font-size: 25px;">
                    RBA
                </b><br>
                {{substr($tahap[0]->tahap, 0, -3)}}
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
                            <b>REKAP ANGGARAN TIAP SUB KEGIATAN (SUMBER DANA) <br> TAHUN ANGGARAN {{ date('Y') }}</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel">
                <tr>
                    <td width="10" style="padding: 10px; font-weight: bold ">NO</td>
                    <td width="150" style="padding: 10px; font-weight: bold; ">NAMA SUB KEGIATAN</td>
                    <td width="50" style="padding: 10px; font-weight: bold;  ">JASA LAYANAN</td>
                    <td width="50" style="padding: 10px; font-weight: bold;  ">APBD</td>
                    <td width="50" style="padding: 10px; font-weight: bold;  ">SUB TOTAL</td>
                </tr>
                @foreach ($data as $dt)
                <tr>
                    @if($dt->div == 2)
                    <td width="20" style="padding: 10px;"><b>{{ substr($dt->kode, -4) }}</b></td>
                    @elseif($dt->div == 3)
                    <td width="20" style="padding: 10px;">{{ substr($dt->kode, -2) }}</td>
                    @endif
                    @if($dt->div == 2)
                    <td width="150" style="padding: 10px;"><b>{{$dt->kegiatan}}</b></td>
                    @elseif($dt->div == 3)
                    <td width="150" style="padding: 10px;">{{$dt->kegiatan}}</td>
                    @endif
                    <td width="50" style="padding: 10px; ">{{ number_format($dt->jasalayanan,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; ">{{ number_format($dt->apbd,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; ">{{ number_format($dt->total,0,',','.') }}</td>
                </tr>
                @endforeach
                {{-- <tr>
                    <td colspan="2" width="20" style="padding: 10px; font-weight: bold; text-align: center;">JUMLAH TOTAL</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($jumlah[0]->jumlahpegawai,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($jumlah[0]->jumlahbarangjasa,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold ;">{{ number_format($jumlah[0]->jumlahmodal,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold; ">{{ number_format($jumlah[0]->total,0,',','.') }}</td>
                </tr> --}}
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