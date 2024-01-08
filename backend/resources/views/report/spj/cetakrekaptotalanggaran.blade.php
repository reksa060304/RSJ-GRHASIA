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
        margin: 10mm 5mm 35mm 17mm;
        size: auto;
    }

    @page :first {
        margin: 10mm 5mm 35mm 17mm;
        size: auto;
    }

    @media print {
    body {
        /* top - right - bottom - left */
        /* margin: 10mm 5mm 10mm 15mm; */
        margin:0;
        /* width:31cm; */
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
<!-- <body style="width:19.5cm;"> -->
<body>
<div>
<table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
        <tbody >
        <tr>
            <td style="padding: 5px; width: 50px;">
                    <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @else
                              <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" style="padding: 5px; width: 300px;">
                <b style="font-size: 23px;">
                    RENCANA BISNIS DAN ANGGARAN<br>
                    BADAN LAYANAN UMUM DAERAH<br>
                    {{ strtoupper($settingrba[0]->pengelolakeuanganblud) }}
                </b>
            </td>
            <td align="center" style="padding: 5px; width: 50px;">
                <b style="font-size: 23px;">
                    RBA
                </b><br>
                {{substr($itahap[0]->tahap, 0, -3)}}
            </td>
        </tr>
        <tr >
            <td colspan="3">
                <p align="center" style="margin-top: 10px; margin-bottom:10px">
                    <font style="font-size: 12pt; " color="#000000">
                            <b>REKAP TOTAL ANGGARAN <br> TAHUN ANGGARAN {{ $itahap[0]->thn }}</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
        <thead>
                <tr>
                    <td align="center"  colspan="2" style="padding: 10px; font-weight: bold ">NO</td>
                    <td align="center" style="padding: 10px; font-weight: bold; ">ALOKASI BIAYA/PENGELUARAN</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">JUMLAH ANGGARAN</td>
                </tr>
        </thead>
                @php
                $totalsebelum = 0;
                @endphp
                <tr>
                    @php
                    $totalsebelum += $jumlah[0]->totalawalsebelum;
                    @endphp
                    <td style="padding: 10px; font-weight: bold; ">I</td>
                    <td style="padding: 10px; font-weight: bold; "></td>
                    <td style="padding: 10px; font-weight: bold;"> BIAYA OPERASIONAL</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($jumlah[0]->totalawalsebelum,0,',','.') }}</td>
                </tr>
                @foreach($sebelum as $sb)
                <tr>
                
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    @php
                    $totalsebelum += $sb->subtotal;
                    @endphp
                    <td style="padding: 10px; font-weight: bold;">{{$sb->kodemataanggaran}}</td>
                    <td style="padding: 10px; font-weight: bold; "></td>
                    @elseif(strpos($sb->kodemataanggaran,'I.') !== false && strlen($sb->kodemataanggaran) == 3)
                    <td style="padding: 10px;"></td>
                    <td style="padding: 10px;">{{substr($sb->kodemataanggaran, -1)}}</td>
                    @else
                    <td style="padding: 10px;"></td>
                    <td style="padding: 10px; "></td>
                    @endif                    
                    @if(strlen($sb->kodemataanggaran) > 3)
                    <td style="padding: 10px; ">{{substr($sb->kodemataanggaran, -1)}}. {{$sb->namamataanggaran}}</td>
                    @else
                        @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                            <td style="padding: 10px; font-weight: bold;">{{$sb->namamataanggaran}}</td>
                        @else
                            <td style="padding: 10px; ">{{$sb->namamataanggaran}}</td>
                        @endif
                    @endif
                    @if($sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                        <td style="padding: 10px; text-align: right; font-weight: bold;   ">{{ number_format($sb->subtotal,0,',','.') }}</td>
                    @else
                        <td style="padding: 10px; text-align: right;    ">{{ number_format($sb->subtotal,0,',','.') }}</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td colspan="3"  style="padding: 10px; text-align: left; font-weight: bold;  text-align:center;">JUMLAH TOTAL</td>
                    <td style="padding: 10px; font-weight: bold;text-align: right;">{{ number_format($totalsebelum,0,',','.') }}</td>
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
                                    Direktur
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
                                   <u>{{$settingrba[0]->namalengkap}}</u>
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
                            NIP. {{$settingrba[0]->nippns}}
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