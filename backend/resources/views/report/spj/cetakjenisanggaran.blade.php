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
<!-- <body style="width:27cm;"> -->
<body>
<div>
    <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel" >
        <tr>
            <td align="center" style="padding: 5px; width: 20px;">
                    <p>
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @else
                              <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" style="padding: 5px; width: 350px;">
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
                {{$tahap[0]->tahap}}
            </td>
        </tr>
        <tr >
            <td colspan="3">
                <p align="center" style="margin-top: 10px; margin-bottom:10px">
                    <font style="font-size: 12pt; " color="#000000">
                            <b>REKAP ANGGARAN TIAP KEGIATAN DAN JENIS ANGGARAN <br> TAHUN ANGGARAN {{ $tahap[0]->thn }}</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
    </table>
        <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
            <thead>
                <tr>
                    <td align="center" style="padding: 10px; font-weight: bold ">KODE KEGIATAN</td>
                    <td align="center" style="padding: 10px; font-weight: bold; ">NAMA KEGIATAN</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">PEGAWAI</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">BARANG JASA</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">MODAL GEDUNG</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">MODAL ALAT DAN MESIN</td>
                    <td align="center" style="padding: 10px; font-weight: bold ; ">MODAL LAINNYA</td>
                    <td align="center" style="padding: 10px; font-weight: bold;  ">SUB TOTAL</td>
                </tr>
            </thead>
                @foreach ($data as $dt)
                <tr>
                    @if($dt->div == 2)
                    <td style="padding: 10px; "><b>{{ $dt->kode }}</b></td>
                    <!-- <td style="padding: 10px; "><b>{{ substr($dt->kode, -4) }}</b></td> -->
                    @elseif($dt->div == 3)
                    <td style="padding: 10px; "><b>{{ $dt->kode }}</b></td>
                    <!-- <td style="padding: 10px; ">{{ substr($dt->kode, -2) }}</td> -->
                    @elseif($dt->div == 4)
                    <td style="padding: 10px; ">{{ $dt->kode }}</td>
                    <!-- <td style="padding: 10px; "></td> -->
                    @endif
                    @if($dt->div == 2)
                    <td style="padding: 10px; "><b>{{$dt->kegiatan}}</b></td>
                    @elseif($dt->div == 3)
                    <td style="padding: 10px; "><b>{{$dt->kegiatan}}</b></td>
                    @elseif($dt->div == 4)
                    <td style="padding: 10px; ">{{$dt->kegiatan}}</td>
                    @endif

                    @if($dt->div == 4)
                    <td align="right" style="padding: 10px;">{{ number_format($dt->jumlahpegawai,0,',','.') == 0 ? "" : number_format($dt->jumlahpegawai,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($dt->jumlahbarangjasa,0,',','.') == 0 ? "" : number_format($dt->jumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($dt->jumlahmodalgedung,0,',','.') == 0 ? "" : number_format($dt->jumlahmodalgedung,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($dt->jumlahmodalalat,0,',','.') == 0 ? "" : number_format($dt->jumlahmodalalat,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($dt->jumlahmodallainnya,0,',','.') == 0 ? "" : number_format($dt->jumlahmodallainnya,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($dt->total,0,',','.') == 0 ? "" : number_format($dt->total,0,',','.') }}</td>
                    @else
                    <td align="right" style="padding: 10px;"><b>{{ number_format($dt->jumlahpegawai,0,',','.') == 0 ? "" : number_format($dt->jumlahpegawai,0,',','.') }}</b></td>
                    <td align="right" style="padding: 10px;"><b>{{ number_format($dt->jumlahbarangjasa,0,',','.') == 0 ? "" : number_format($dt->jumlahbarangjasa,0,',','.') }}</b></td>
                    <td align="right" style="padding: 10px;"><b>{{ number_format($dt->jumlahmodalgedung,0,',','.') == 0 ? "" : number_format($dt->jumlahmodalgedung,0,',','.') }}</b></td>
                    <td align="right" style="padding: 10px;"><b>{{ number_format($dt->jumlahmodalalat,0,',','.') == 0 ? "" : number_format($dt->jumlahmodalalat,0,',','.') }}</b></td>
                    <td align="right" style="padding: 10px;"><b>{{ number_format($dt->jumlahmodallainnya,0,',','.') == 0 ? "" : number_format($dt->jumlahmodallainnya,0,',','.') }}</b></td>
                    <td align="right" style="padding: 10px;"><b>{{ number_format($dt->total,0,',','.') == 0 ? "" : number_format($dt->total,0,',','.') }}</b></td>
                    @endif

                </tr>
                @endforeach
                <tr>
                    <td colspan="2" style="padding: 10px; font-weight: bold; text-align: center; ">JUMLAH TOTAL</td>
                    <td align="right" style="padding: 10px; font-weight: bold;  ">{{ number_format($jumlah[0]->jumlahpegawai,0,',','.') == 0 ? "" : number_format($jumlah[0]->jumlahpegawai,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold;  ">{{ number_format($jumlah[0]->jumlahbarangjasa,0,',','.') == 0 ? "" : number_format($jumlah[0]->jumlahbarangjasa,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold ; ">{{ number_format($jumlah[0]->jumlahmodalgedung,0,',','.') == 0 ? "" : number_format($jumlah[0]->jumlahmodalgedung,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold ; ">{{ number_format($jumlah[0]->jumlahmodalalat,0,',','.') == 0 ? "" : number_format($jumlah[0]->jumlahmodalalat,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold ; ">{{ number_format($jumlah[0]->jumlahmodallainnya,0,',','.') == 0 ? "" : number_format($jumlah[0]->jumlahmodallainnya,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold;  ">{{ number_format($jumlah[0]->total,0,',','.') == 0 ? "" : number_format($jumlah[0]->total,0,',','.') }}</td>
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
                    <td width="700">
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
                    <td width="700">
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