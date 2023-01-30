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
<style>
    @page {
        margin:15mm 15mm 20mm 20mm;
    }

    @page :first {
        margin:15mm 15mm 20mm 20mm;
    }

    @media print {
    body {
        margin:0;
        width:31cm;
    }
    }

    body {
        font-family: Arial;
    }

    table{
		font-family:'Arial';
		margin:0;
		padding:.1cm 0;
		font-size:11pt ;
	}	

    .tabel tr td{
        border: 1px solid black;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
</style>
<body style="width:19.5cm;">
<div>
    <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
        <tbody >
        <tr>
            <td rowspan="2" align="center" style="padding: 10px;">
                    <p>
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @else
                              <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" style="padding: 3px;">
                <b style="font-size: 23px;">
                    RENCANA BISNIS DAN ANGGARAN<br>
                    BADAN LAYANAN UMUM DAERAH
                </b>
            </td>
            <td rowspan="2"  align="center" style="padding: 3px;">
                <b style="font-size: 23px;">
                    RBA
                </b><br>
                {{substr($tahap[0]->tahap, 0, -3)}}
            </td>
        </tr>
        <tr align="center">
            <td>
                <b>RS Jiwa GRHASIA<br>TAHUN {{ date('Y') }}</b>
            </td>
        </tr>
        <tr >
            <td colspan="3">
                <p align="center" style="margin-top: 10px; margin-bottom:10px">
                    <font style="font-size: 12pt; " color="#000000">
                            <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ date('Y') }}</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
        <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
                <tr">
                    <td align="center" style="padding: 10px; font-weight: bold ">NO</td>
                    <td align="center" style="padding: 10px; font-weight: bold; ">NAMA SUB KEGIATAN</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">PEGAWAI</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">BARANG JASA</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">MODAL</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">SUB TOTAL</td>
                </tr>
                @foreach ($data as $dt)
                <tr>
                    @if($dt->div == 2)
                    <td style="padding: 10px; "><b>{{ substr($dt->kode, -4) }}</b></td>
                    @elseif($dt->div == 3)
                    <td style="padding: 10px; ">{{ substr($dt->kode, -2) }}</td>
                    @endif
                    @if($dt->div == 2)
                    <td style="padding: 10px; "><b>{{$dt->kegiatan}}</b></td>
                    @elseif($dt->div == 3)
                    <td style="padding: 10px; ">{{$dt->kegiatan}}</td>
                    @endif
                    <td align="right" style="padding: 10px;">{{ number_format($dt->jumlahpegawai,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($dt->jumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($dt->jumlahmodal,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($dt->total,0,',','.') }}</td>
                </tr>
                @endforeach
                <tr>
                    <td colspan="2" style="padding: 10px; font-weight: bold; text-align: center; ">JUMLAH TOTAL</td>
                    <td align="right" style="padding: 10px; font-weight: bold;  ">{{ number_format($jumlah[0]->jumlahpegawai,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold;  ">{{ number_format($jumlah[0]->jumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold ; ">{{ number_format($jumlah[0]->jumlahmodal,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold;  ">{{ number_format($jumlah[0]->total,0,',','.') }}</td>
                </tr>
        </table>
        <table cellpadding="0" cellspacing="0" width="100%"  border="0">
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
</div>
<script>
    window.print()
</script>
</body>
</html>