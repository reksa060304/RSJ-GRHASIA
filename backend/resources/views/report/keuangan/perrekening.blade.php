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
                        LAPORAN REKAP PENYERAPAN ANGGARAN PER-REKENING
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
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel">
                <tr>
                    <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold;font-size: 15px; ">NO. REK</td>
                    <td align="center" width="150" rowspan="2" style="padding: 10px; font-weight: bold;font-size: 15px; ">NAMA REKENING</td>
                    <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold; font-size: 15px; ">JUMLAH ANGGARAN</td>
                    <td align="center" width="50" colspan="4" style="padding: 10px; font-weight: bold;font-size: 15px;  ">PENYERAPAN ANGGARAN TERVERIFIKASI</td>
                    <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold ;font-size: 15px; ">JUMLAH SISA ANGGARAN</td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;">Jumlah Panjar</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Jumlah SPJ</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">Sub Total</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">%</td>
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
                $persentase += $dt->persentase;
                $sisaanggaran += $dt->sisaanggaran;
                @endphp
                <tr style="border: 1px solid black;">
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;">{{ $dt->kodemataanggaran }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->namamataanggaran }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->jumlahpanjar,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahspj,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->subtotal,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ $dt->persentase }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->sisaanggaran,0,',','.') }}</td>
                </tr>
                @endforeach
                <tr style="border: 1px solid black;">
                    <td align="center" width="50" colspan="2" style="padding: 10px; font-weight: bold;  font-size: 15px;">JUMLAH TOTAL</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($jumlahanggaran,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($jumlahpanjar,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;">{{ number_format($jumlahspj,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;">{{ number_format($subtotal,0,',','.') }}</td>
                    @if($jumlahanggaran != 0)
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format(round($subtotal/$jumlahanggaran*100, 2),0,',','.') }}</td>
                    @else
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format(0,0,',','.') }}</td>
                    @endif
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($sisaanggaran,0,',','.') }}</td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>