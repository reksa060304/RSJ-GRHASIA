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
    <p style="text-align: left; margin-top: 50px; font-size: 20px;">Tahun anggaran: {{ $tahunAnggaran }}</p>
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

                    $kodeKegiatan = null;

                @endphp
                
                @foreach ($data as $dt)
                    
                    {{-- Kegiatan--}}
                    @if ($dt->kode && ($dt->kode !== $kodeKegiatan))
                        
                        @php
                            $anggaranKegiatan = 0;
                            $spjKegiatan = 0;
                            
                            foreach ($data as $row) {
                                if($dt->kode == $row->kode){
                                    $anggaranKegiatan += (float)$row->jumlahanggaran;
                                    $spjKegiatan += (float)$row->jumlahspj;
                                }
                            }

                        @endphp
                        <tr style="font-weight: bold;">
                            <td>{{ $dt->kode }}</td>
                            <td style="width: auto;">{{ $dt->keterangankegiatan }}</td>
                            <td>{{ number_format($anggaranKegiatan ,2,',','.')}}</td>
                            <td>{{ number_format($spjKegiatan ,2,',','.')}}</td>
                            @if ($spjKegiatan > 0 && $anggaranKegiatan > 0)
                                <td>{{ number_format($spjKegiatan / $anggaranKegiatan * 100, 2)}}</td>
                            @else
                                <td>0</td>
                            @endif
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
                                    <td>{{ number_format($rek->jumlahspj ,2,',','.') }}</td>
                                    @if ($rek->jumlahanggaran > 0 && $rek->jumlahspj > 0)
                                        <td>{{ number_format($rek->jumlahanggaran / $rek->jumlahspj * 100, 2)}}</td>
                                    @else
                                        <td>0</td>
                                    @endif
                                </tr>
                            @endif
                        @endforeach
                    @endif
                    

                @endforeach
</div>
<script>
    window.print()
</script>
</body>
</html>