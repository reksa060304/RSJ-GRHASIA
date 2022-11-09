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
                        BUKU REKAPITULASI PENGELUARAN<br>
                        BADAN LAYANAN UMUM DAERAH (BLUD)<br>
                        PER RINCIAN OBYEK<br>
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
                    <p style="text-align: left; font-size: 20px; margin-top:15px;">: RS Jiwa GRHASIA DINKES DIY</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Sub Kegiatan</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{ $data[1]->subkegiatan }}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Sub Sub Kegiatan</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{ $data[1]->subsubkegiatan }}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Kode Rekening</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{ $data[1]->kodemataanggaran }}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Nama Rekening</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{ $data[1]->namamataanggaran }}</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">Anggaran</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:-5px;">: Rp {{ number_format($totalanggaran,2,',','.') }}</p>
                </td>
            </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 50px;">
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Tanggal</td>
                    <td align="center" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">Uraian</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">No. BKU</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">Pengeluaran</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">Sisa</td>
                </tr>
                
                @foreach ($data as $dt)
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->tgl }}</td>
                    <td align="left" width="200" style="padding: 10px;  font-size: 15px; ">{{ $dt->uraianbku }}</td>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->nobku }}</td>
                    @if($dt->uraianbku == 'ANGGARAN')
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; "></td>
                    @else
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->pengeluaran,0,',','.') }}</td>
                    @endif
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->saldoawal,0,',','.') }}</td>
                </tr>
                @endforeach
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 50px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">Mengetahui</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Yogyakarta, {{ $tanggalcetak }}</td>
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