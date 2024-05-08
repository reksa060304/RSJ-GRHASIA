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
    @media print {
        div {
            display: block;
            break-inside: avoid;
            
        }
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
                    <b style="font-size: 22px;">
                        PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA<br>
                        LAPORAN PERTANGGUNGJAWABAN BENDAHARA PENGELUARAN<br>
                        (SPJ BELANJA - FUNGSIONAL)<br>
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
    <table bgcolor="#FFFFFF" width="{{$pageWidth}}" >
        <tbody >
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px; ">SKPD</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;">: 1.02.2.22.0.00.01.0004-RS Jiwa GRHASIA DINKES DIY</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Kuasa Pengguna Anggaran</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: dr. Akhmad Akhadi Syamsudhuha, M.P.H</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Bendahara</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: Paula Sofyanita, SE.</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Tahun Anggaran</p>
                </td>
                <td></td>
                <td align="left">
                    {{-- <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$tahun}}</p> --}}
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Periode s/d</p>
                </td>
                <td></td>
                <td align="left">
                    {{-- <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{substr($tanggaljudul, 0, -5)}}</p> --}}
                </td>
            </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 50px;">
                <tr>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 12px; ">KODE REKENING</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 12px; ">URAIAN</td>
                    <td align="center" rowspan="2" width="200" style="padding: 10px; font-weight: bold; font-size: 12px; ">JUMLAH ANGGARAN</td>
                    <td align="center" colspan="3" width="50" style="padding: 10px; font-weight: bold;font-size: 12px;  ">REALISASI GU/TU/UP/LS</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 12px; ">SISA ANGGARAN</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 12px; ">PENGEMBALIAN BELANJA</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 12px; ">PENGELUARAN BELANJA BERSIH</td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 12px; ">Bulan lalu</td>
                    <td align="center" width="100" style="padding: 10px; font-weight: bold;font-size: 12px; ">Bulan ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 12px; ">Jumlah</td>
                </tr>
                @foreach ($head as $item)
                    <tr>
                        <td align="left" width="50" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }}; ">{{ $item->kode }}</td>
                        <td align="left" width="50" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }}; ">{{ $item->text }}</td>
                        <td align="right" width="50" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }};  ">{{ number_format($item->subtotal,2,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }}; ">{{ number_format($item->totalbulanlalu,2,',','.') }}</td>
                        <td align="right" width="100" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }}; ">{{ number_format($item->totalbulanini,2,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }}; ">{{ number_format($item->totalbulanlalu + $item->totalbulanini,2,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }}; ">{{ number_format($item->subtotal - $item->totalbulanlalu - $item->totalbulanini,2,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }}; ">0</td>
                        <td align="right" width="50" style="padding: 10px; font-size: 12px;font-weight: {{ $item->code == 0 ? 'bold' : 'normal' }}; ">{{ number_format($item->totalbulanlalu + $item->totalbulanini,2,',','.') }}</td>
                    </tr>
                @endforeach
                @foreach ($div4 as $dt)
                    <tr>                        
                        @foreach ($bulandiv4 as $item)
                            @if ($dt->id == $item->objectkegiatanfk)
                                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 12px; ">{{ $dt->kode }}</td>
                                <td align="left" width="50" style="font-weight: bold; padding: 10px; font-size: 12px; ">{{ $dt->keterangan }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 12px;  ">{{ number_format($dt->total,2,',','.') }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 12px; ">{{ number_format($item->totalbulanlalu, 2, ',', '.') }}</td>
                                <td align="right" width="100" style="font-weight: bold; padding: 10px; font-size: 12px; ">{{ number_format($item->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 12px; ">{{ number_format($item->totalbulanlalu + $item->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 12px; ">{{ number_format($dt->total - $item->totalbulanlalu - $item->totalbulanini,2,',','.') }}</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 12px; ">0</td>
                                <td align="right" width="50" style="font-weight: bold; padding: 10px; font-size: 12px; ">{{ number_format($item->totalbulanlalu + $item->totalbulanini,2,',','.') }}</td>
                                @foreach ($detail as $items)
                                    @if ($dt->id == $items->objectkegiatanfk && $dt->id == $item->objectkegiatanfk)
                                        <tr>
                                            @php
                                                $found = false;
                                            @endphp
            
                                            @foreach ($detaildiv4 as $dd)
                                                @if ($items->objectkegiatanfk == $dd->objectkegiatanfk && $dd->kodemataanggaran == $items->kodemataanggaran && $dd->namamataanggaran == $items->namamataanggaran)
                                                    @php
                                                        $found = true;
                                                    @endphp
                                                    <td align="left" width="50" style="padding: 10px; font-size: 12px; "></td>
                                                    <td align="left" width="50" style="padding: 10px; font-size: 12px; ">{{ $items->kodemataanggaran }} {{ $items->namamataanggaran }}</td>
                                                    <td align="right" width="50" style="padding: 10px; font-size: 12px;  ">{{ number_format($items->total,2,',','.') }}</td>
                                                    <td align="right" width="50" style="padding: 10px; font-size: 12px;">{{ number_format($dd->totalbulanlalu, 2, ',', '.') }}</td>
                                                    <td align="right" width="50" style="padding: 10px; font-size: 12px;">{{ number_format($dd->totalbulanini, 2, ',', '.') }}</td>
                                                    <td align="right" width="50" style="padding: 10px; font-size: 12px;">{{ number_format($dd->totalbulanlalu + $dd->totalbulanini, 2, ',', '.') }}</td>
                                                    <td align="right" width="50" style="padding: 10px; font-size: 12px;">{{ number_format($items->total - $dd->totalbulanlalu - $dd->totalbulanini, 2, ',', '.') }}</td>
                                                    <td align="right" width="50" style="padding: 10px; font-size: 12px;">0</td>
                                                    <td align="right" width="50" style="padding: 10px; font-size: 12px;">{{ number_format($dd->totalbulanlalu + $dd->totalbulanini, 2, ',', '.') }}</td>        
                                                @endif
                                            @endforeach
                                            @if (!$found)
                                                <td align="left" width="50" style="padding: 10px; font-size: 12px; "></td>
                                                <td align="left" width="50" style="padding: 10px; font-size: 12px; ">{{ $items->kodemataanggaran }} {{ $items->namamataanggaran }}</td>
                                                <td align="right" width="50" style="padding: 10px; font-size: 12px;  ">{{ number_format($items->total,2,',','.') }}</td>
                                                <td align="right" width="50" style="padding: 10px; font-size: 12px;">0</td>
                                                <td align="right" width="50" style="padding: 10px; font-size: 12px;">0</td>
                                                <td align="right" width="50" style="padding: 10px; font-size: 12px;">0</td>
                                                <td align="right" width="50" style="padding: 10px; font-size: 12px;">0</td>
                                                <td align="right" width="50" style="padding: 10px; font-size: 12px;">0</td>
                                                <td align="right" width="50" style="padding: 10px; font-size: 12px;">0</td>
                                            @endif
                                        </tr>
                                    @endif
                                @endforeach
                            @endif                            
                        @endforeach                        
                    </tr>
                    
                @endforeach                
        </table>
    </div>
<script>
    window.print()
</script>
</body>
</html>