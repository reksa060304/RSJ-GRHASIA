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
        page-break-inside: avoid;
        word-wrap: break-word;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;
        table-layout:fixed;
    }

    .tabels tr td{
        border: 0.5px solid black;
        page-break-inside: avoid;
    }

    .tabels {
        width: 100%;
        border-collapse: collapse;

    }

    .tabelss {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid black;
    }

    .tabelss tr td{
        page-break-inside: avoid;
    }

    textarea {
        border: none;
        outline: none;
        resize: none;
        font-family: Arial;
    }
</style>
<body style="width:27cm;">
<div>
<table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
        <tbody >
        <tr>
            <td rowspan="2" align="center" style="padding: 15px;">
                    <p>
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @else
                              <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" style="padding: 3px;" width="700">
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
                <tr>
                    <td align="center" width="5"  rowspan="2" style="padding: 5px; font-weight: bold; word-wrap: break-word">NO</td>
                    <td align="center" width="20" rowspan="2" style="padding: 5px; font-weight: bold; word-wrap: break-word">KETERANGAN</td>
                    <td align="center" width="55" colspan="4"style="padding: 5px; text-align: center; font-weight: bold;word-wrap: break-word">ANGGARAN SEBELUM PERUBAHAN</td>
                    <td align="center" width="55" colspan="4" style="padding: 5px; text-align: center; font-weight: bold;word-wrap: break-word">ANGGARAN SESUDAH PERUBAHAN</td>
                    <td align="center" width="10" rowspan="2" style="padding: 5px; font-weight: bold ; word-wrap: break-word">BERTAMBAH / BERKURANG</td>
                </tr>
                <tr>
                    <td align="center" width="25" style="padding: 5px; font-weight: bold;  word-wrap: break-word">PEGAWAI</td>
                    <td align="center" width="20" style="padding: 5px; font-weight: bold;  word-wrap: break-word">BARANG<br>JASA</td>
                    <td align="center" width="20" style="padding: 5px; font-weight: bold ; word-wrap: break-word">MODAL</td>
                    <td align="center" width="20" style="padding: 5px; font-weight: bold;  word-wrap: break-word">SUB TOTAL</td>
                    <td align="center" width="25" style="padding: 5px; font-weight: bold;  word-wrap: break-word">PEGAWAI</td>
                    <td align="center" width="20" style="padding: 5px; font-weight: bold;  word-wrap: break-word">BARANG<br>JASA</td>
                    <td align="center" width="20" style="padding: 5px; font-weight: bold ; word-wrap: break-word">MODAL</td>
                    <td align="center" width="20" style="padding: 5px; font-weight: bold;  word-wrap: break-word">SUB TOTAL</td>
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
                    <td align="center" width="15" style="padding: 5px; word-wrap: break-word"><b>{{ substr($sb->kode, -4) }}</b></td>
                    @elseif($sb->div == 3)
                    <td align="center" width="15" style="padding: 5px; word-wrap: break-word">{{ substr($sb->kode, -2) }}</td>
                    @endif
                    @if($sb->div == 2)
                    <td align="left" width="20" style="padding: 5px;word-wrap: break-word"><b>{{$sb->kegiatan}}</b></td>
                    @elseif($sb->div == 3)
                    <td align="left" width="20" style="padding: 5px;word-wrap: break-word">{{$sb->kegiatan}}</td>
                    @endif
                    <td align="right" width="25" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->jumlahpegawai,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->jumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->jumlahmodal,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->total,0,',','.') }}</td>
                    <td align="right" width="25" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->kjumlahpegawai,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->kjumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->kjumlahmodal,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->ktotal,0,',','.') }}</td>
                    @if($sb->ktotal > $sb->total)
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->ktotal-$sb->total,0,',','.') }}</td>
                    @elseif($sb->ktotal < $sb->total)
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">{{ number_format($sb->total-$sb->ktotal,0,',','.') }}</td>
                    @else
                    <td align="right" width="20" style="padding: 5px;word-wrap: break-word">0</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td align="center" colspan="2" width="20" style="padding: 5px; font-weight: bold; text-align: center; word-wrap: break-word"> JUMLAH TOTAL</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  word-wrap: break-word">{{ number_format($sebelumjumlahpegawai,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  word-wrap: break-word">{{ number_format($sebelumjumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold ; word-wrap: break-word">{{ number_format($sebelumjumlahmodal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  word-wrap: break-word">{{ number_format($sebelumtotal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  word-wrap: break-word">{{ number_format($sesudahjumlahpegawai,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  word-wrap: break-word">{{ number_format($sesudahjumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold ; word-wrap: break-word">{{ number_format($sesudahjumlahmodal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  word-wrap: break-word">{{ number_format($sesudahtotal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  word-wrap: break-word">{{ number_format($berkurang,0,',','.') }}</td>
                </tr>
        </table>
        <table cellpadding="0" cellspacing="0" width="100%"  border="0">
            <thead>
                <tr>
                    <td width="700">
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
                    <td width="700">
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
                    <td width="700">
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
                    <td width="700">
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