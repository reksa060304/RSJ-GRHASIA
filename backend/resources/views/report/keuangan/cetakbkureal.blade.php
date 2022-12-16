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
                        BUKU SIMPANAN BANK<br>
                        BENDAHARA PENGELUARAN<br>
                        TAHUN ANGGARAN {{ $tahunjudul }}<br>
                        BULAN {{ $periode }}
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 50px;">
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">No. BKU</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Tanggal</td>
                    <td align="center" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">Nomor Dokumen</td>
                    <td align="center" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">Uraian</td>
                    <td align="center" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">Kode Rekening</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">Penerimaan</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">Pengeluaran</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">Saldo</td>
                </tr>
                
                @foreach ($data as $dt)
                <tr>
                    <td align="left" width="100" style="padding: 10px; font-size: 15px; ">{{ $dt->nobku }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->tgl }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->nodokumen }}</td>
                    <td align="left" width="200" style="padding: 10px;  font-size: 15px; ">{{ $dt->uraianbku }}</td>
                    <td align="center" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->objectmataanggaranfk }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  ">{{ number_format($dt->penerimaan,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->pengeluaran,0,',','.') }}</td>
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