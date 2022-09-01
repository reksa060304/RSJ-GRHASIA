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
                <tr>
                    <td width="15"  rowspan="2" style="padding: 10px; font-weight: bold ">NO</td>
                    <td width="50" rowspan="2" style="padding: 10px; font-weight: bold;border-left: 3px solid black; ">KETERANGAN</td>
                    <td colspan="4"style="padding: 10px; text-align: center; font-weight: bold;border-left: 3px solid black;border-bottom: 3px solid black;  ">ANGGARAN SEBELUM PERUBAHAN</td>
                    <td colspan="4" style="padding: 10px; text-align: center; font-weight: bold;border-left: 3px solid black;border-bottom: 3px solid black;  ">ANGGARAN SESUDAH PERUBAHAN</td>
                    <td width="20" rowspan="2" style="padding: 10px; font-weight: bold ;border-left: 3px solid black; ">BERTAMBAH / BERKURANG</td>
                </tr>
                <tr>
                    <td width="20" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">PEGAWAI</td>
                    <td width="20" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">BARANG JASA</td>
                    <td width="20" style="padding: 10px; font-weight: bold ;border-left: 3px solid black; ">MODAL</td>
                    <td width="20" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">SUB TOTAL</td>
                    <td width="20" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">PEGAWAI</td>
                    <td width="20" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">BARANG JASA</td>
                    <td width="20" style="padding: 10px; font-weight: bold ;border-left: 3px solid black; ">MODAL</td>
                    <td width="20" style="padding: 10px; font-weight: bold;border-left: 3px solid black;  ">SUB TOTAL</td>
                </tr>
                @php
                $sebelumjumlahbarangjasa = 0;
                $sebelumjumlahmodal = 0;
                $sebelumjumlahpegawai = 0;
                $sebelumtotal = 0;
                $sesudahjumlahbarangjasa = 0;
                $sesudahjumlahmodal = 0;
                $sesudahjumlahpegawai = 0;
                $sesudahtotal = 0;
                $berkurang = 0;
                @endphp
                @foreach($sebelum as $sb)
                <tr>
                    @if($sb->div == 2)
                        @php
                        $sebelumjumlahbarangjasa += $sb->jumlahbarangjasa;
                        $sebelumjumlahmodal += $sb->jumlahmodal;
                        $sebelumjumlahpegawai += $sb->jumlahpegawai;
                        $sebelumtotal += $sb->total;
                        $sesudahjumlahbarangjasa += $sb->kjumlahbarangjasa;
                        $sesudahjumlahmodal += $sb->kjumlahmodal;
                        $sesudahjumlahpegawai += $sb->kjumlahpegawai;
                        $sesudahtotal += $sb->ktotal;
                        $sb->ktotal > $sb->total ? $berkurang += ($sb->ktotal - $sb->total) : $berkurang += ($sb->total - $sb->ktotal);
                        
                        @endphp
                    @endif
                    @if($sb->div == 2)
                    <td width="15" style="padding: 10px; border-top: 3px solid black; "><b>{{ substr($sb->kode, -4) }}</b></td>
                    @elseif($sb->div == 3)
                    <td width="15" style="padding: 10px; border-top: 3px solid black; ">{{ substr($sb->kode, -2) }}</td>
                    @endif
                    @if($sb->div == 2)
                    <td width="50" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;"><b>{{$sb->kegiatan}}</b></td>
                    @elseif($sb->div == 3)
                    <td width="50" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->kegiatan}}</td>
                    @endif
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->jumlahpegawai}}</td>
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->jumlahbarangjasa}}</td>
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->jumlahmodal}}</td>
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->total}}</td>
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->kjumlahpegawai}}</td>
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->kjumlahbarangjasa}}</td>
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->kjumlahmodal}}</td>
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->ktotal}}</td>
                    @if($sb->ktotal > $sb->total)
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->ktotal-$sb->total}}</td>
                    @elseif($sb->ktotal < $sb->total)
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">{{$sb->total-$sb->ktotal}}</td>
                    @else
                    <td width="20" style="padding: 10px; border-top: 3px solid black; border-left: 3px solid black;">0</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td colspan="2" width="20" style="padding: 10px; font-weight: bold; text-align: center; border-top: 3px solid black;">JUMLAH TOTAL</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{$sebelumjumlahpegawai}}</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{$sebelumjumlahbarangjasa}}</td>
                    <td width="50" style="padding: 10px; font-weight: bold ;border-left: 3px solid black;border-top: 3px solid black; ">{{$sebelumjumlahmodal}}</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{$sebelumtotal}}</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{$sesudahjumlahpegawai}}</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{$sesudahjumlahbarangjasa}}</td>
                    <td width="50" style="padding: 10px; font-weight: bold ;border-left: 3px solid black;border-top: 3px solid black; ">{{$sesudahjumlahmodal}}</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{$sesudahtotal}}</td>
                    <td width="50" style="padding: 10px; font-weight: bold;border-left: 3px solid black; border-top: 3px solid black; ">{{$berkurang}}</td>
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