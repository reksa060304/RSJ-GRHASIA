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
    <p style="text-align: left; margin-top: 50px; font-size: 20px;">SKPD&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&emsp;&nbsp;&nbsp; : 1.02.2.22.0.00.01.0004-RS Jiwa GRHASIA DINKES DIY</p>
    <p style="text-align: left; font-size: 20px; margin-top:-10px;">Kuasa Pengguna Anggaran &nbsp; : 2022</p>
    <p style="text-align: left; font-size: 20px; margin-top:-10px;">Bendahara&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&emsp;&nbsp;&nbsp;: 2022</p>
    <p style="text-align: left; font-size: 20px; margin-top:-10px;">Tahun Anggaran &nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;: 2022</p>
    <p style="text-align: left; font-size: 20px; margin-top:-10px;">Bulan&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;: 2022</p>
    <p style="text-align: left; font-size: 20px; margin-top:-10px;">Periode s/d &nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;: 2022</p>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 50px;">
                <tr>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">KODE REKENING</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">URAIAN</td>
                    <td align="center" rowspan="2" width="200" style="padding: 10px; font-weight: bold; font-size: 15px; ">JUMLAH ANGGARAN</td>
                    <td align="center" colspan="3" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">REALISASI GU/TU/UP/LS</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">SISA ANGGARAN</td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Bulan lalu</td>
                    <td align="center" width="100" style="padding: 10px; font-weight: bold;font-size: 15px; ">Bulan ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">Jumlah</td>
                </tr>
                @foreach ($data as $dt)
                <tr>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->kode }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->text }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px;  ">{{ number_format($dt->subtotal,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->totalbulanlalu,2,',','.') }}</td>
                    <td align="right" width="100" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->totalbulanini,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->totalbulanlalu + $dt->totalbulanini,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->subtotal - $dt->totalbulanlalu - $dt->totalbulanini,2,',','.') }}</td>
                </tr>
                @endforeach
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 50px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">Mengetahui</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Yogyakarta, 03 November 2022</td>
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