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

            $kodeKegiatan = null;
        @endphp
        @foreach ($data as $dt)
            {{-- Kegiatan--}}
            @if ($dt->kode && ($dt->kode !== $kodeKegiatan))
                        
                @php
                    $anggaranKegiatan = 0;
                    $spjbulanlalu = 0;
                    $spjbulanini = 0;

                    foreach ($data as $row) {
                        if($dt->kode == $row->kode){
                            $anggaranKegiatan += (float)$row->jumlahanggaran;
                            $spjbulanlalu += (float)$row->totalspjbulanlalu;
                            $spjbulanini += (float)$row->totalspjbulanini;
                        }
                    }

                @endphp
                <tr style="font-weight: bold;">
                    <td>{{ $dt->kode }}</td>
                    <td style="width: auto;">{{ $dt->keterangankegiatan }}</td>
                    <td>{{ number_format($anggaranKegiatan ,2,',','.')}}</td>
                    <td>{{ number_format($spjbulanlalu ,2,',','.')}}</td>
                    <td>{{ number_format($spjbulanini ,2,',','.')}}</td>
                    <td>{{ number_format($spjbulanlalu + $spjbulanini ,2,',','.')}}</td>
                    @if ($anggaranKegiatan > 0 && ($spjbulanlalu > 0 || $spjbulanini >0))
                        <td>{{ number_format(($spjbulanlalu + $spjbulanini) / $anggaranKegiatan * 100, 2)}}</td>
                    @else
                        <td>0</td>
                    @endif
                    <td>{{ number_format($anggaranKegiatan - ($spjbulanlalu + $spjbulanini), 2,',','.')}}</td>
                </tr>

                @php
                    $kodeKegiatan = $dt->kode;
                @endphp
                
                {{-- rekening --}}
                @foreach ($data as $rek)
                    @if ($rek->kode === $kodeKegiatan)
                        <tr>
                            <td>{{ $rek->kodemataanggaran }}</td>
                            <td>{{ $rek->namamataanggaran }}</td>
                            <td>{{ number_format($rek->jumlahanggaran ,2,',','.')}}</td>
                            <td>{{ number_format($rek->totalspjbulanlalu ,2,',','.')}}</td>
                            <td>{{ number_format($rek->totalspjbulanini ,2,',','.')}}</td>
                            <td>{{ number_format($rek->totalspjbulanlalu + $rek->totalspjbulanini ,2,',','.')}}</td>
                            @if ($rek->jumlahanggaran > 0 && ($rek->totalspjbulanlalu > 0 || $rek->totalspjbulanini >0))
                                <td>{{ number_format(($rek->totalspjbulanlalu + $rek->totalspjbulanini) / $rek->jumlahanggaran * 100, 2)}}</td>
                            @else
                                <td>0</td>
                            @endif
                            <td>{{ number_format($rek->jumlahanggaran - ($rek->totalspjbulanlalu + $rek->totalspjbulanini) ,2,',','.')}}</td>
                        </tr>
                    @endif
                @endforeach
            @endif
        @endforeach
    </table>
</div>
<script>
    window.print()
</script>
</body>
</html>