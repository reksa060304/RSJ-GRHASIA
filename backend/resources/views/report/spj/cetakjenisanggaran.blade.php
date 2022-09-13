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
        margin: 30;  /* this affects the margin in the printer settings */
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
    <table class="bayangprint" bgcolor="#FFFFFF" width="{{$pageWidth}}" style="border-left: 3px solid black; border-right: 3px solid black; border-top: 3px solid black;">
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
                <tr">
                    <td width="20" style="padding: 10px; font-weight: bold ">NO</td>
                    <td width="150" style="padding: 10px; font-weight: bold;border-left: 3px solid black; ">NAMA SUB KEGIATAN</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">PEGAWAI</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">BARANG JASA</td>
                    <td width="50" style="padding: 10px; font-weight: bold ;border-left: 3px solid black; ">MODAL</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">SUB TOTAL</td>
                </tr>
                @foreach ($data as $dt)
                <tr>
                    @if($dt->div == 2)
                    <td width="20" style="padding: 10px; border-top: 3px solid black; "><b>{{ substr($dt->kode, -4) }}</b></td>
                    @elseif($dt->div == 3)
                    <td width="20" style="padding: 10px; border-top: 3px solid black; ">{{ substr($dt->kode, -2) }}</td>
                    @endif
                    @if($dt->div == 2)
                    <td width="150" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;"><b>{{$dt->kegiatan}}</b></td>
                    @elseif($dt->div == 3)
                    <td width="150" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$dt->kegiatan}}</td>
                    @endif
                    <td width="50" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{ number_format($dt->jumlahpegawai,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{ number_format($dt->jumlahbarangjasa,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{ number_format($dt->jumlahmodal,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{ number_format($dt->total,0,',','.') }}</td>
                </tr>
                @endforeach
                <tr>
                    <td colspan="2" width="20" style="padding: 10px; font-weight: bold; text-align: center; border-top: 3px solid black;">JUMLAH TOTAL</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{ number_format($jumlah[0]->jumlahpegawai,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{ number_format($jumlah[0]->jumlahbarangjasa,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold ;border-left: 3px solid black;border-top: 3px solid black; ">{{ number_format($jumlah[0]->jumlahmodal,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{ number_format($jumlah[0]->total,0,',','.') }}</td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Mengetahui,
                            </font>
                        </p>
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