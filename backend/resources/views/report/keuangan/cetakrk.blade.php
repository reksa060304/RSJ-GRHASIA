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
                    <b style="font-size: 22px;">LAPORAN REKAPITULASI PER SUB SUB KEGIATAN</b>
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
                    <p style="text-align: left; font-size: 20px; margin-top:15px;">:  1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Sub Kegiatan</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$data[0]->keterangan}}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Sub Sub Kegiatan</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$data[1]->keterangan}}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Jumlah Anggaran</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{ number_format($data[1]->jumlahanggaran,2,',','.') }}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Tahun Anggaran</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$tahunjudul}}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Bulan</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$periode}}</p>
                </td>
            </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 30px;">
                <tr>
                    <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold;font-size: 15px; ">KODE REKENING</td>
                    <td align="center" width="150" rowspan="2" style="padding: 10px; font-weight: bold;font-size: 15px; ">URAIAN</td>
                    <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold; font-size: 15px; ">JUMLAH ANGGARAN</td>
                    <td align="center" width="50" colspan="3" style="padding: 10px; font-weight: bold;font-size: 15px;  ">REALISASI GU/TU/UP/LS</td>
                    <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold ;font-size: 15px; ">SISA ANGGARAN</td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;">Bulan lalu</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Bulan ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">Jumlah</td>
                </tr>
                @foreach ($data as $dt)
                <tr style="border: 1px solid black;">
                @if(strlen($dt->div) != 15 && strlen($dt->div) != 16 && (strlen($dt->div) == 17 || strlen($dt->div) == 18))
                    <td align="left" width="50" style="font-weight:bold; padding: 10px;  font-size: 15px;">{{ $dt->kode }}</td>
                    <td align="left" width="50" style="font-weight:bold; padding: 10px; font-size: 15px; ">{{ $dt->keterangan }}</td>
                    <td align="right" width="50" style="font-weight:bold; padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran,2,',','.') }}</td>
                    <td align="right" width="50" style="font-weight:bold; padding: 10px; font-size: 15px; ">{{ number_format($dt->jumlahbulanlalu,2,',','.') }}</td>
                    <td align="right" width="50" style="font-weight:bold; padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahbulanini,2,',','.') }}</td>
                    <td align="right" width="50" style="font-weight:bold; padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahbulanlalu + $dt->jumlahbulanini,2,',','.') }}</td>
                    <td align="right" width="50" style="font-weight:bold; padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran - $dt->jumlahbulanlalu - $dt->jumlahbulanini,2,',','.') }}</td>
                @elseif(strlen($dt->div) != 15 && strlen($dt->div) != 16 && strlen($dt->div) != 17 && strlen($dt->div) != 18)
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;">{{ $dt->kode }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->keterangan }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->jumlahbulanlalu,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahbulanini,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahbulanlalu + $dt->jumlahbulanini,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran - $dt->jumlahbulanlalu - $dt->jumlahbulanini,2,',','.') }}</td>
                @endif
                </tr>
                @endforeach
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 50px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">Mengetahui</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Yogyakarta, {{$tanggalcetak}}</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: -20px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">Pimpinan BLUD RS. Jiwa Grhasia DIY</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Bendahara Pengeluaran</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 150px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">dr. Akhmad Akhadi Syamsudhuha, M.P.H</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Paula Sofyanita, SE.</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: -20px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">NIP. 19680714 200012 1 002</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">NIP. 19910622 201502 2 002</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>