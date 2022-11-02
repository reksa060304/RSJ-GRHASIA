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
                    <b style="font-size: 22px;">1.02.01.004 - RUMAH SAKIT JIWA GRHASIA <br> LAPORAN OPERASIONAL <br> Untuk Periode Yang Berakhir Sampai Dengan 31 Desember {{$tahun}} dan {{$tahunlalu}}
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 50px;">
                <tr>
                    <td align="center" width="350" style="padding: 10px; font-weight: bold;font-size: 15px; ">Uraian</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">{{$tahun}}</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">{{$tahunlalu}}</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">Kenaikan/Penurunan</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">(%)</td>
                </tr>
                <tr>
                    <td align="center" width="350" style="padding: 10px; font-weight: bold;font-size: 15px; ">1</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">2</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">3</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;  ">4</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold ;font-size: 15px; ">5</td>
                </tr>
                @foreach ($data as $dt)
                <tr style="border: 1px solid black;">
                @if(strlen($dt->noaccount) == 1)
                    <td align="left" width="50" style="padding: 10px 10px 10px 10px;  font-size: 15px;"><b>{{ $dt->namaaccount }}</b></td>
                @elseif(strlen($dt->noaccount) == 3)
                    <td align="left" width="50" style="padding: 10px 10px 10px 20px;  font-size: 15px;"><b>{{ $dt->namaaccount }}</b></td>
                @elseif(strlen($dt->noaccount) == 6)
                    <td align="left" width="50" style="padding: 10px 10px 10px 30px;  font-size: 15px;"><b>{{ $dt->namaaccount }}</b></td>
                @elseif(strlen($dt->noaccount) == 9)
                    <td align="left" width="50" style="padding: 10px 10px 10px 40px;  font-size: 15px;"><b>{{ $dt->namaaccount }}</b></td>
                @elseif(strlen($dt->noaccount) == 12)
                    <td align="left" width="50" style="padding: 10px 10px 10px 50px;  font-size: 15px;"><b>{{ $dt->namaaccount }}</b></td>
                @elseif(strlen($dt->noaccount) == 17)
                    <td align="left" width="50" style="padding: 10px 10px 10px 60px;  font-size: 15px;">{{ $dt->namaaccount }}</td>
                @endif
                    <td align="right" width="50" style="padding: 10px; font-size: 15px; ">{{ number_format($dt->subtotalbulanini,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->subtotalbulanlalu,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->selisih,2,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->persentase,2,',','.') }}</td>
                </tr>
                @endforeach
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>