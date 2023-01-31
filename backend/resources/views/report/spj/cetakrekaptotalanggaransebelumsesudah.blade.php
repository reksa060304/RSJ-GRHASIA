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
        size: potrait;
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
<body style="width:19.5cm;">
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
                {{substr($itahap[0]->tahap, 0, -3)}}
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
                    <td align="center"width="20"  colspan="2" style="padding: 10px; font-weight: bold ">NO</td>
                    <td align="center" width="200" style="padding: 10px; font-weight: bold; ">ALOKASI BIAYA/PENGELUARAN</td>
                    <td align="center" width="50" style="padding: 10px; text-align: center; font-weight: bold;  ">SEBELUM PERUBAHAN</td>
                    <td align="center" width="50" style="padding: 10px; text-align: center; font-weight: bold; ">SETELAH PERUBAHAN</td>
                    <td align="center" width="20" style="padding: 10px; font-weight: bold ; ">BERTAMBAH / (BERKURANG)</td>
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