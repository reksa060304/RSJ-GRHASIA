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
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
</style>
<body style="width:19.5cm;">
<div>
<table cellpadding="0" cellspacing="0" width="100%"  border="0">
        <tbody >
            <tr>
                <td align="center" style="width: 200px;">
                    <b style="font-size: 25px;">
                        LAPORAN PENYERAPAN ANGGARAN PER SUB SUB KEGIATAN
                    </b>
                </td>
            </tr>
            <tr align="center">
                <td>
                    <b style="font-size: 22px;">RS Jiwa Grhasia Dinas Kesehatan Daerah Istimewa Yogyakarta</b>
                </td>
            </tr>
        </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" width="100%"  border="0">
        <tbody>
        <tr >
            <td colspan="3">
                <tr>
                    <td>
                        <p align="left" style="margin-top:20px">
                                <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Tahun anggaran 
                                </font>
                        </p>
                    </td>
                    <td>
                        <p align="left" style="margin-top:20px">
                                <font style="font-size: 12pt; " color="#000000" face="Arial">
                                : {{ $tahun }}
                                </font>
                        </p>
                    </td>
                </tr>
                <tr style="margin-top: -10px;">
                    <td>
                        <p align="left" style="margin-top:5px">
                                <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Sub Kegiatan
                                </font>
                        </p>
                    </td>
                    <td>
                        <p align="left" style="margin-top:5px">
                                <font style="font-size: 12pt; " color="#000000" face="Arial">
                                : {{ $subkegiatan[0]->kode.' - '.$subkegiatan[0]->keterangan }}
                                </font>
                        </p>
                    </td>
                </tr>
                <tr style="margin-top: -10px;">
                    <td>
                        <p align="left" style="margin-top:5px">
                                <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Sub Sub Kegiatan
                                </font>
                        </p>
                    </td>
                    <td>
                        <p align="left" style="margin-top:5px">
                                <font style="font-size: 12pt; " color="#000000" face="Arial">
                                : {{ $subsubkegiatan[0]->kode.' - '.$subsubkegiatan[0]->keterangan }}
                                </font>
                        </p>
                    </td>
                </tr>
            </td>
        </tr>
        </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabel" style="margin-top: 30px;">
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">NO. REK</td>
                    <td align="center" width="150" style="padding: 10px; font-weight: bold;font-size: 15px; ">NAMA REKENING</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">JUMLAH ANGGARAN KAS</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">JUMLAH SPJ TEVERIFIKASI</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">%</td>
                </tr>
                @php
                $jumlahanggaran = 0;
                $jumlahpanjar = 0;
                $jumlahspj = 0;
                $subtotal = 0;
                $persentase = 0;
                $sisaanggaran = 0;
                @endphp
                @foreach ($data as $dt)
                @php
                $jumlahanggaran += $dt->jumlahanggaran;
                $jumlahpanjar += $dt->jumlahpanjar;
                $jumlahspj += $dt->jumlahspj;
                $subtotal += $dt->subtotal;
                $persentase += ($dt->jumlahspj/$dt->jumlahanggaran) * 100;
                $sisaanggaran += $dt->sisaanggaran;
                @endphp
                <tr style="border: 1px solid black;">
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;">{{ $dt->kodemataanggaran }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->namamataanggaran }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahspj,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format(($dt->jumlahspj/$dt->jumlahanggaran) * 100,2,',','.') }}</td>
                </tr>
                @endforeach
                <tr style="border: 1px solid black;">
                    <td align="center" width="50" colspan="2" style="padding: 10px; font-weight: bold;  font-size: 15px;">JUMLAH TOTAL</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($jumlahanggaran,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;">{{ number_format($jumlahspj,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($persentase,2,',','.') }}</td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>