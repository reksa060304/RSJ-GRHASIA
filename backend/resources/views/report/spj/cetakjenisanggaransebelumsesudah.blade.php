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
    @page { 
        size: landscape;
    }
    body {
        margin:0;
        width: 210mm;
        height: 297mm;
        min-height: 297mm;
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
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
</style>
<body style="width:35cm;">
<div>
<table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
        <tbody >
        <tr>
            <td rowspan="2" align="center" style="padding: 5px;">
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
                <tr>
                    <td width="15"  rowspan="2" style="padding: 5px; font-weight: bold ">NO</td>
                    <td width="50" rowspan="2" style="padding: 5px; font-weight: bold; ">KETERANGAN</td>
                    <td colspan="4"style="padding: 5px; text-align: center; font-weight: bold;">ANGGARAN SEBELUM PERUBAHAN</td>
                    <td colspan="4" style="padding: 5px; text-align: center; font-weight: bold;">ANGGARAN SESUDAH PERUBAHAN</td>
                    <td width="20" rowspan="2" style="padding: 5px; font-weight: bold ; ">BERTAMBAH / BERKURANG</td>
                </tr>
                <tr>
                    <td width="20" style="padding: 5px; font-weight: bold;  ">PEGAWAI</td>
                    <td width="20" style="padding: 5px; font-weight: bold;  ">BARANG JASA</td>
                    <td width="20" style="padding: 5px; font-weight: bold ; ">MODAL</td>
                    <td width="20" style="padding: 5px; font-weight: bold;  ">SUB TOTAL</td>
                    <td width="20" style="padding: 5px; font-weight: bold;  ">PEGAWAI</td>
                    <td width="20" style="padding: 5px; font-weight: bold;  ">BARANG JASA</td>
                    <td width="20" style="padding: 5px; font-weight: bold ; ">MODAL</td>
                    <td width="20" style="padding: 5px; font-weight: bold;  ">SUB TOTAL</td>
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
                    <td width="15" style="padding: 5px; "><b>{{ substr($sb->kode, -4) }}</b></td>
                    @elseif($sb->div == 3)
                    <td width="15" style="padding: 5px; ">{{ substr($sb->kode, -2) }}</td>
                    @endif
                    @if($sb->div == 2)
                    <td width="50" style="padding: 5px;"><b>{{$sb->kegiatan}}</b></td>
                    @elseif($sb->div == 3)
                    <td width="50" style="padding: 5px;">{{$sb->kegiatan}}</td>
                    @endif
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->jumlahpegawai,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->jumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->jumlahmodal,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->total,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->kjumlahpegawai,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->kjumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->kjumlahmodal,0,',','.') }}</td>
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->ktotal,0,',','.') }}</td>
                    @if($sb->ktotal > $sb->total)
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->ktotal-$sb->total,0,',','.') }}</td>
                    @elseif($sb->ktotal < $sb->total)
                    <td align="right" width="20" style="padding: 5px;">{{ number_format($sb->total-$sb->ktotal,0,',','.') }}</td>
                    @else
                    <td align="right" width="20" style="padding: 5px;  ">0</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td colspan="2" width="20" style="padding: 5px; font-weight: bold; text-align: center; "> JUMLAH TOTAL</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  ">{{ number_format($sebelumjumlahpegawai,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  ">{{ number_format($sebelumjumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold ; ">{{ number_format($sebelumjumlahmodal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  ">{{ number_format($sebelumtotal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  ">{{ number_format($sesudahjumlahpegawai,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  ">{{ number_format($sesudahjumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold ; ">{{ number_format($sesudahjumlahmodal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  ">{{ number_format($sesudahtotal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold;  ">{{ number_format($berkurang,0,',','.') }}</td>
                </tr>
        </table>
        <table cellpadding="0" cellspacing="0" width="100%"  border="0">
            <thead>
                <tr>
                    <td width="1000">
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
                    <td width="1000">
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
                    <td width="1000">
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
                    <td width="1000">
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