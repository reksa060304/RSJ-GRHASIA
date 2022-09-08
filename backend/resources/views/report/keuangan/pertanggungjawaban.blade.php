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
        margin: 30;  /* this affects the margin in the printer settings */
    }
</style>
<style>

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }

    .tabel tr td{
        border: 1px solid black;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;
    }
</style>
<body style="background-color: #CCCCCC;">
<div align="center" >
    <table bgcolor="#FFFFFF" width="{{$pageWidth}}" >
        <tbody >
            <tr>
                <td align="center" style="width: 200px;">
                    <b style="font-size: 25px;">
                        PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA
                    </b>
                </td>
            </tr>
            <tr align="center">
                <td>
                    <b style="font-size: 22px;">LAPORAN PERTANGGUNGJAWABAN BENDAHARA PENGELUARAN <br> (SPJ BELANJA - FUNGSIONAL)
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
    <p style="text-align: left; margin-top: 50px; font-size: 20px;">SKPD &emsp;&emsp;&emsp;&emsp;&emsp;: 1.02.2.22.0.00.01.0004-RS Jiwa GRHASIA DINKES DIY</p>
    <p style="text-align: left; font-size: 20px; margin-top:-10px;">Tahun Anggaran &nbsp;: {{ $tahun }}</p>
    <p style="text-align: left; font-size: 20px; margin-top:-10px;">Bulan &emsp;&emsp;&emsp;&emsp;&emsp;: {{ $periode }}</p>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel">
                <tr>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Nomor Sub Sub Keg / Rekening Anggaran</td>
                    <td align="center" rowspan="2" width="150" style="padding: 10px; font-weight: bold;font-size: 15px; ">Nama Sub Sub Keg / Nama Rekening Anggaran</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">Jumlah Anggaran</td>
                    <td align="center" colspan="4" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">Rincian SPJ UP/GU/TU</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">Jumlah Sisa Anggaran</td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">s.d. Bulan lalu</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Bulan ini </td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">s.d. Bulan ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">%</td>
                </tr>
                @php
                $jumlahanggaran = 0;
                $sdbulanlalu = 0;
                $bulanini = 0;
                $semuabulan = 0;
                $persentase = 0;
                $jumlahsisa = 0;
                @endphp
                @foreach ($data as $dt)
                <tr style="border: 1px solid black;">
                    @if($dt->bold == 'iya')
                    @php
                    $jumlahanggaran += $dt->jumlahanggaran;
                    $sdbulanlalu += $dt->jumlahspjsdbulanlalu;
                    $bulanini += $dt->jumlahspjbulanini;
                    $semuabulan += $dt->totalsemuabulan;
                    $persentase += $dt->persentase;
                    $jumlahsisa += $dt->sisaanggaran;
                    @endphp
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ $dt->kode }}</b></td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; "><b>{{ $dt->keterangan }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->jumlahanggaran,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($dt->jumlahspjsdbulanlalu,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->jumlahspjbulanini,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->totalsemuabulan,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ $dt->persentase }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->sisaanggaran,0,',','.') }}</b></td>
                    @elseif($dt->bold == 'tidak')
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;">{{ $dt->kode }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->keterangan }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahspjsdbulanlalu,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahspjbulanini,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->totalsemuabulan,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ $dt->persentase }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->sisaanggaran,0,',','.') }}</td>
                    @endif
                    
                </tr>
                @endforeach
                <tr>
                    <td align="center" colspan="2" width="50" style="padding: 10px;  font-size: 15px;"><b>JUMLAH TOTAL</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($jumlahanggaran,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($sdbulanlalu,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($bulanini,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($semuabulan,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ $persentase }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($jumlahsisa,0,',','.') }}</b></td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>