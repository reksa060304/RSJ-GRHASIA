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
            <td rowspan="2"  style="padding: 15px; width: 50px;" align="center">
                    <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @else
                              <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" style="width: 300px;">
                <b style="font-size: 25px;">
                    BADAN LAYANAN UMUM DAERAH
                </b>
            </td>
            <td rowspan="2"  align="center" style="width: 150px;">
                <b style="font-size: 25px;">
                    
                </b><br>
                
            </td>
        </tr>
        <tr align="center">
            <td>
                <b>RS Jiwa GRHASIA</b>
            </td>
        </tr>
        <tr >
        <td colspan="3">
                <p align="left" style="margin-top: 10px; margin-bottom:10px; margin-left:10px">
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Urusan Pemerintahan &emsp;&emsp; : 
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Organisasi &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; : 
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Waktu Pelaksanaan &emsp;&emsp;&emsp;&nbsp;: 
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Lokasi Kegiatan &emsp;&emsp;&emsp;&emsp;&emsp;: 
                    </font>
                </p>
            </td>
        </tr>
        <tr >
            <td colspan="3">
                <p align="center" style="margin-top: 10px; margin-bottom:10px">
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            <b>PENDAPATAN OPERASIONAL BLUD TAHUN ANGGARAN</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel">
                <tr>
                    <td align="center" width="50" style="padding: 5px; font-weight: bold ">No.</td>
                    <td align="center" width="50" style="padding: 5px; font-weight: bold ">Uraian Pendapatan</td>
                    <td align="center" width="50" style="padding: 5px; font-weight: bold ">Jumlah</td>
                    <td align="center" width="50" style="padding: 5px; font-weight: bold ">Keterangan</td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 5px; font-weight: bold ">1</td>
                    <td align="center" width="50" style="padding: 5px; font-weight: bold ">2</td>
                    <td align="center" width="50" style="padding: 5px; font-weight: bold ">3</td>
                    <td align="center" width="50" style="padding: 5px; font-weight: bold ">4</td>
                </tr>
                @php
                    $no = 0;
                    $total = 0;
                @endphp
                @foreach($data as $dt)
                <tr>
                    @if($dt->bold == 'iya' || $dt->bold == 'juga')
                    @php
                        $no++;
                        $total += $dt->jumlah;
                    @endphp
                            <td align="center" width="50" style="padding: 5px; font-weight: bold ">{{ $no }}</td>
                            <td align="left" width="50" style="padding: 5px; font-weight: bold ">{{ $dt->namaexternal }}</td>
                            <td align="right" width="50" style="padding: 5px; font-weight: bold ">{{ number_format($dt->jumlah,0,',','.') }}</td>
                            <td align="left" width="50" style="padding: 5px; font-weight: bold ">{{ $dt->keterangan }}</td>
                    @else
                    <td align="center" width="50" style="padding: 5px;"></td>
                    <td align="left" width="50" style="padding: 5px;">{{ $dt->namaexternal }}</td>
                    <td align="right" width="50" style="padding: 5px;">{{ number_format($dt->jumlah,0,',','.') }}</td>
                    <td align="left" width="50" style="padding: 5px;">{{ $dt->keterangan }}</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td align="center" width="50" colspan="2" style="padding: 5px; font-weight: bold ">JUMLAH TOTAL PENDAPATAN</td>
                    <td align="right" width="50" style="padding: 5px; font-weight: bold ">{{ number_format($total,0,',','.') }}</td>
                    <td align="left" width="50" style="padding: 5px; font-weight: bold "></td>
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