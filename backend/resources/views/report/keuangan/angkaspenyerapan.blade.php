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
                        LAPORAN PERSANDINGAN ANGKAS BELANJA DAN PENYERAPAN
                    </b>
                </td>
            </tr>
            <tr align="center">
                <td>
                    <b style="font-size: 22px;">RS Jiwa GRHASIA DINKES DIY</b>
                </td>
            </tr>
        </tbody>
    </table>
    <p style="text-align: left; margin-top: 50px; font-size: 20px;">Tahun anggaran: {{ $tahun }}</p>
    <p style="text-align: left; font-size: 20px;">Periode bulan: {{ $bawal }} s/d {{ $bakhir }}</p>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel">
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">NO. REK</td>
                    <td align="center" width="150" style="padding: 10px; font-weight: bold;font-size: 15px; ">NAMA REKENING</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">JUMLAH ANGGARAN KAS</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">JUMLAH SPJ TERVERIFIKASI</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">%</td>
                </tr>
                @php
                $jumlahanggaran = 0;
                $jumlahspj = 0;
                $persentase = 0;
                @endphp
                @foreach ($data as $dt)
                <tr style="border: 1px solid black;">
                    @if($dt->bold == 'iya')
                    @php
                        $jumlahanggaran += $dt->jumlahanggaran;
                        $jumlahspj += $dt->jumlahspj;
                        $persentase += $dt->persentase;
                    @endphp
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ $dt->kode }}</b></td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; "><b>{{ $dt->keterangan }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ $dt->jumlahanggaran }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ $dt->jumlahspj }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ $dt->persentase }}</b></td>
                    @elseif($dt->bold == 'tidak')
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;">{{ $dt->kode }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->keterangan }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ $dt->jumlahanggaran }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ $dt->jumlahspj }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ $dt->persentase }}</td>
                    @endif
                    
                </tr>
                @endforeach
                <tr style="border: 1px solid black;">
                    <td align="center" width="50" colspan="2" style="padding: 10px; font-weight: bold;  font-size: 15px;">JUMLAH TOTAL</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "><b>{{ $jumlahanggaran }}</b></td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;"><b>{{ $jumlahspj }}</b></td>
                    @if($jumlahanggaran != 0)
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "><b>{{ round($jumlahspj/$jumlahanggaran*100, 2) }}</b></td>
                    @else
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "><b>0</b></td>
                    @endif
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>