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
                    <td align="center" width="5" rowspan="2" colspan="2" style="padding: 10px; font-weight: bold ">NO</td>
                    <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold; ">ALOKASI BIAYA/PENGELUARAN</td>
                    <td align="center" width="50" colspan="2" style="padding: 10px; text-align: center; font-weight: bold;  ">ANGGARAN SEBELUM PERUBAHAN</td>
                    <td align="center" width="50" colspan="2" style="padding: 10px; text-align: center; font-weight: bold;">SETELAH PERUBAHAN</td>
                    <td align="center" width="50" colspan="2" style="padding: 10px; text-align: center; font-weight: bold;">JUMLAH BERTAMBAH / BERKURANG</td>
                    {{-- <td width="20" style="padding: 10px; font-weight: bold ; ">BERTAMBAH / (BERKURANG)</td> --}}
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; ">APBD</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; ">Jasa Layanan</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; ">APBD</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; ">Jasa Layanan</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; ">APBD</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; ">Jasa Layanan</td>
                </tr>
                @php
                $totaljasalayanansebelum = 0;
                $totaljasalayanansesudah = 0;
                $totaljasalayananberkurang = 0;
                $totalapbdsebelum = 0;
                $totalapbdsesudah = 0;
                $totalapbdberkurang = 0;
                @endphp
                <tr>
                    <td width="5" style="padding: 10px; font-weight: bold;  ">I</td>
                    <td width="5" style="padding: 10px; font-weight: bold;  "></td>
                    <td width="20" style="padding: 10px; font-weight: bold;">BIAYA OPERASIONAL</td>
                    <td width="50" style="padding: 10px; text-align: left; font-weight: bold; text-align: right;">{{ number_format($jumlah[0]->subtotalapbd,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: left; font-weight: bold; text-align: right;">{{ number_format($jumlah[0]->subtotaljasalayanan,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: left; font-weight: bold; text-align: right;">{{ number_format($jumlah[0]->subtotalapbdsetelah,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: left; font-weight: bold; text-align: right;">{{ number_format($jumlah[0]->subtotaljasalayanansetelah,0,',','.') }}</td>
                    
                    @if($jumlah[0]->subtotalapbd > $jumlah[0]->subtotalapbdsetelah)
                    <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($jumlah[0]->subtotalapbd-$jumlah[0]->subtotalapbdsetelah,0,',','.') }}</td>
                    @php
                    $totalapbdberkurang += $jumlah[0]->subtotalapbd - $jumlah[0]->subtotalapbdsetelah;
                    @endphp
                    @elseif($jumlah[0]->subtotalapbd < $jumlah[0]->subtotalapbdsetelah)
                    <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($jumlah[0]->subtotalapbdsetelah-$jumlah[0]->subtotalapbd,0,',','.') }}</td>
                    @php
                    $totalapbdberkurang += $jumlah[0]->subtotalapbdsetelah - $jumlah[0]->subtotalapbd;
                    @endphp
                    @else
                    @php
                    $totalapbdberkurang += 0;
                    @endphp
                    <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">0</td>
                    @endif
                    @if($jumlah[0]->subtotaljasalayanan > $jumlah[0]->subtotaljasalayanansetelah)
                    @php
                    $totaljasalayananberkurang += $jumlah[0]->subtotaljasalayanan - $jumlah[0]->subtotaljasalayanansetelah;
                    @endphp
                    <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($jumlah[0]->subtotaljasalayanan-$jumlah[0]->subtotaljasalayanansetelah,0,',','.') }}</td>
                    @elseif($jumlah[0]->subtotaljasalayanan < $jumlah[0]->subtotaljasalayanansetelah)
                    @php
                    $totaljasalayananberkurang += $jumlah[0]->subtotaljasalayanansetelah - $jumlah[0]->subtotaljasalayanan;
                    @endphp
                    <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($jumlah[0]->subtotaljasalayanansetelah-$jumlah[0]->subtotaljasalayanan,0,',','.') }}</td>
                    @else
                    @php
                    $totaljasalayananberkurang += 0;
                    @endphp
                    <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">0</td>
                    @endif
                    
                </tr>
                @foreach($sebelum as $sb)
                <tr>
                
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    @php
                        $totaljasalayanansebelum += $sb->subtotaljasalayanansebelum + $jumlah[0]->subtotaljasalayanan;
                        $totaljasalayanansesudah += $sb->subtotaljasalayanansetelah + $jumlah[0]->subtotaljasalayanansetelah;
                        $totalapbdsebelum += $sb->subtotalapbdsebelum + $jumlah[0]->subtotalapbd;
                        $totalapbdsesudah += $sb->subtotalapbdsetelah + $jumlah[0]->subtotalapbdsetelah;
                    @endphp
                    <td width="10" style="padding: 10px; font-weight: bold;">{{$sb->kodemataanggaran}}</td>
                    <td width="10" style="padding: 10px; font-weight: bold;  "></td>
                    @elseif(strpos($sb->kodemataanggaran,'I.') !== false && strlen($sb->kodemataanggaran) == 3)
                    <td width="10" style="padding: 10px;"></td>
                    <td width="10" style="padding: 10px;  ">{{substr($sb->kodemataanggaran, -1)}}</td>
                    @else
                    <td width="10" style="padding: 10px;"></td>
                    <td width="10" style="padding: 10px;  "></td>
                    @endif                    
                    @if(strlen($sb->kodemataanggaran) > 3)
                    <td width="50" style="padding: 10px;">{{substr($sb->kodemataanggaran, -1)}}. {{$sb->namamataanggaran}}</td>
                    @else
                        @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                            <td width="20" style="padding: 10px; font-weight: bold">{{$sb->namamataanggaran}}</td>
                        @else 
                            <td width="20" style="padding: 10px;">{{$sb->namamataanggaran}}</td>
                        @endif
                    @endif
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    <td width="50" style="padding: 10px; text-align: right; font-weight: bold;  ">{{ number_format($sb->subtotalapbdsebelum,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: right; font-weight: bold;">{{ number_format($sb->subtotaljasalayanansebelum,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: right; font-weight: bold;  ">{{ number_format($sb->subtotalapbdsetelah,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: right; font-weight: bold;">{{ number_format($sb->subtotaljasalayanansetelah,0,',','.') }}</td>
                    @else
                    <td width="50" style="padding: 10px; text-align: right;   ">{{ number_format($sb->subtotalapbdsebelum,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: right; ">{{ number_format($sb->subtotaljasalayanansebelum,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: right;   ">{{ number_format($sb->subtotalapbdsetelah,0,',','.') }}</td>
                    <td width="50" style="padding: 10px; text-align: right; ">{{ number_format($sb->subtotaljasalayanansetelah,0,',','.') }}</td>
                    @endif
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                        @if($sb->subtotalapbdsebelum > $sb->subtotalapbdsetelah)
                        @php
                        $totalapbdberkurang += $sb->subtotalapbdsebelum - $sb->subtotalapbdsetelah;
                        @endphp
                        <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($sb->subtotalapbdsebelum-$sb->subtotalapbdsetelah,0,',','.') }}</td>
                        @elseif($sb->subtotalapbdsebelum < $sb->subtotalapbdsetelah)
                        @php
                        $totalapbdberkurang += $sb->subtotalapbdsetelah - $sb->subtotalapbdsebelum;
                        @endphp
                        <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($sb->subtotalapbdsetelah-$sb->subtotalapbdsebelum,0,',','.') }}</td>
                        @else
                        @php
                        $totalapbdberkurang += 0 
                        @endphp
                        <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">0</td>
                        @endif
                        @if($sb->subtotaljasalayanansebelum > $sb->subtotaljasalayanansetelah)
                        @php
                        $totalapbdberkurang += $sb->subtotalapbdsebelum - $sb->subtotalapbdsetelah;
                        @endphp
                        <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($sb->subtotaljasalayanansebelum-$sb->subtotaljasalayanansetelah,0,',','.') }}</td>
                        @elseif($sb->subtotaljasalayanansebelum < $sb->subtotaljasalayanansetelah)
                        @php
                        $totalapbdberkurang += $sb->subtotalapbdsetelah - $sb->subtotalapbdsebelum;
                        @endphp
                        <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($sb->subtotaljasalayanansetelah-$sb->subtotaljasalayanansebelum,0,',','.') }}</td>
                        @else
                        @php
                        $totalapbdberkurang += 0 
                        @endphp
                        <td width="20" style="padding: 10px; font-weight: bold;text-align: right;">0</td>
                        @endif
                    @else
                        @if($sb->subtotalapbdsebelum > $sb->subtotalapbdsetelah)
                        @php
                        $totaljasalayananberkurang += $sb->subtotalapbdsebelum - $sb->subtotalapbdsetelah;
                        @endphp
                        <td width="20" style="padding: 10px; text-align: right;">{{ number_format($sb->subtotalapbdsebelum-$sb->subtotalapbdsetelah,0,',','.') }}</td>
                        @elseif($sb->subtotalapbdsebelum < $sb->subtotalapbdsetelah)
                        @php
                        $totaljasalayananberkurang += $sb->subtotalapbdsetelah - $sb->subtotalapbdsebelum;
                        @endphp
                        <td width="20" style="padding: 10px; text-align: right;">{{ number_format($sb->subtotalapbdsetelah-$sb->subtotalapbdsebelum,0,',','.') }}</td>
                        @else
                        @php
                        $totaljasalayananberkurang += 0;
                        @endphp
                        <td width="20" style="padding: 10px; text-align: right;">0</td>
                        @endif
                        @if($sb->subtotaljasalayanansebelum > $sb->subtotaljasalayanansetelah)
                        @php
                        $totaljasalayananberkurang += $sb->subtotalapbdsebelum - $sb->subtotalapbdsetelah;
                        @endphp
                        <td width="20" style="padding: 10px; text-align: right;">{{ number_format($sb->subtotaljasalayanansebelum-$sb->subtotaljasalayanansetelah,0,',','.') }}</td>
                        @elseif($sb->subtotaljasalayanansebelum < $sb->subtotaljasalayanansetelah)
                        @php
                        $totaljasalayananberkurang += $sb->subtotalapbdsetelah - $sb->subtotalapbdsebelum;
                        @endphp
                        <td width="20" style="padding: 10px; text-align: right;">{{ number_format($sb->subtotaljasalayanansetelah-$sb->subtotaljasalayanansebelum,0,',','.') }}</td>
                        @else
                        @php
                        $totaljasalayananberkurang += 0;
                        @endphp
                        <td width="20" style="padding: 10px; text-align: right;">0</td>
                        @endif
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td  colspan="3"  style="padding: 10px; text-align: left; font-weight: bold; text-align:center;">JUMLAH TOTAL</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totalapbdsebelum,0,',','.') }}</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totaljasalayanansebelum,0,',','.') }}</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totalapbdsesudah,0,',','.') }}</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totaljasalayanansesudah,0,',','.') }}</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totalapbdberkurang,0,',','.') }}</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totaljasalayananberkurang,0,',','.') }}</td>
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