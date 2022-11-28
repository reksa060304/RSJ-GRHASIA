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
                <td align="center">
                    <b style="font-size: 25px;">
                        PROVINSI DI YOGYAKARTA
                    </b>
                </td>
            </tr>
            <tr align="center">
                <td>
                    <b style="font-size: 22px;">LAPORAN PERTANGGUNGJAWABAN BENDAHARA PENGELUARAN <br> SPJ - ADMINISTRATIF <br> Bulan : {{$periode}}
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
    <table bgcolor="#FFFFFF" width="{{$pageWidth}}">
        <tbody >
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;font-weight:bold;">Nomor SPJ</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;">: 04.00/05.0/000017/SPJ-SKPD/1.02.2.22.0.00.01.0004/P.04/10/2022</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;font-weight:bold;">SKPD</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;">: 1.02.2.22.0.00.01.0004 RUMAH SAKIT JIWA GRHASIA</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;font-weight:bold;">Kuasa Pengguna Anggaran</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;">: dr. Akhmad Akhadi Syamsu Dhuha, MPH</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;font-weight:bold;">Bendahara Pengeluaran Pembantu</p>
                </td>
                <td></td>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;">: Paula Sofyanita,SE</p>
                </td>
            </tr>
            <tr>
                <td align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;font-weight:bold;">Tahun Anggaran</p>
                </td>
                <td colspan="14" align="left">
                    <p style="text-align: left; font-size: 20px; margin-top:15px;">: {{$tahun}}</p>
                </td>
            </tr>
        </tbody>
    </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 20px;">
                <tr>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;">Kode Rekening</td>
                    <td align="center" rowspan="2" width="150" style="padding: 10px; font-weight: bold;font-size: 15px;">Uraian</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;">Jumlah Anggaran</td>
                    <td align="center" colspan="3" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;">SPJ - LS Gaji</td>
                    <td align="center" colspan="3" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;">SPJ - LS Barang & Jasa</td>
                    <td align="center" colspan="3" width="50" style="padding: 10px; font-weight: bold;font-size: 15px;">SPJ - UP/GU/TU</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;">Jumlah SPJ (LS + UP/GU/TU) s.d Bulan ini</td>
                    <td align="center" rowspan="2" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;">Sisa Pagu Anggaran</td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">s.d. Bulan Lalu</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Bulan Ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">s.d. Bulan Ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">s.d. Bulan Lalu</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Bulan Ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">s.d. Bulan Ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">s.d. Bulan Lalu</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Bulan Ini</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">s.d. Bulan Ini</td>
                </tr>
                <tr>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">1</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">2</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">3</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">4</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">5</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">6=(4+5)</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">7</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">8</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">9=(7+8)</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">10</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">11</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">12=(10+11)</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">13=(6+9+12)</td>
                    <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">14=(3-13)</td>
                </tr>
                @foreach ($data as $dt)
                <tr style="border: 1px solid black;">
                    @if($dt->bold == 'iya')
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ $dt->kode }}</b></td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; "><b>{{ $dt->keterangan }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->jumlahanggaran,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($dt->jumlahspjsdbulanlalugaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->jumlahspjbulaninigaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->totalsemuabulangaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($dt->jumlahspjsdbulanlalubarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->jumlahspjbulaninibarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->totalsemuabulangaji + $dt->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($dt->jumlahanggaran - $dt->totalsemuabulangaji - $dt->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    @elseif($dt->bold == 'tidak')
                    <td align="left" width="50" style="padding: 10px;  font-size: 15px;">{{ $dt->kode }}</td>
                    <td align="left" width="50" style="padding: 10px; font-size: 15px; ">{{ $dt->keterangan }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran,3,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahspjsdbulanlalugaji,3,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahspjbulaninigaji,3,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->totalsemuabulangaji,3,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($dt->jumlahspjsdbulanlalubarangjasa,3,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahspjbulaninibarangjasa,3,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->totalsemuabulanbarangjasa,3,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format(0,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format(0,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format(0,0,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->totalsemuabulangaji + $dt->totalsemuabulanbarangjasa,3,',','.') }}</td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($dt->jumlahanggaran - $dt->totalsemuabulangaji - $dt->totalsemuabulanbarangjasa,3,',','.') }}</td>
                    @endif
                </tr>
                @endforeach
                <tr style="border: 1px solid black;">
                    <td colspan = "2" align="left" width="50" style="padding: 10px; font-size: 15px; "><b>JUMLAH</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahanggaran,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalugaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninigaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalubarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninibarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji + $total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahanggaran - $total[0]->totalsemuabulangaji - $total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>Penerimaan:</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>-SP2D:</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>UP</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>GU</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>TU</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan = "2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px; "><b>LS</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalugaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninigaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalubarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninibarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji + $total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>-Pelimpahan SP2D:</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>Pelimpahan UP</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>Pelimpahan GU</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>Pelimpahan TU</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>-Potongan:</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                @foreach($iuran as $pm)
                    <tr style="border: 1px solid black;">
                        <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;">{{$pm->text}}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($pm->totalbulanlalu,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    </tr>
                @endforeach
                @foreach($penerimaan as $pm)
                @if($pm->padding == 'false')
                    <tr style="border: 1px solid black;">
                        <td colspan="2" align="left" width="50" style="padding: 10px; font-size: 15px;"><b>{{$pm->text}}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($pm->totalbulanlalu,3,',','.') }}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($pm->totalbulanini,3,',','.') }}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    </tr>
                @else
                    <tr style="border: 1px solid black;">
                        <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;">{{$pm->text}}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($pm->totalbulanlalu,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    </tr>
                @endif
                @endforeach
                <tr style="border: 1px solid black;">
                    <td colspan = "2" align="left" width="50" style="padding: 10px; font-size: 15px; "><b>Jumlah Penerimaan (SP2D Bruto) :</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalugaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninigaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalubarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninibarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji + $total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahanggaran - $total[0]->totalsemuabulangaji - $total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>Pegeluaran:</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>-SP2D:</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>UP/GU</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>TU</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan = "2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px; "><b>LS</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalugaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninigaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalubarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninibarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji + $total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px;  font-size: 15px;"><b>-Potongan:</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                @foreach($iuran as $pm)
                    <tr style="border: 1px solid black;">
                        <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;">{{$pm->text}}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($pm->totalbulanlalu,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    </tr>
                @endforeach
                @foreach($pengeluaran as $pm)
                @if($pm->padding == 'false')
                    <tr style="border: 1px solid black;">
                        <td colspan="2" align="left" width="50" style="padding: 10px; font-size: 15px;"><b>{{$pm->text}}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($pm->totalbulanlalu,3,',','.') }}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($pm->totalbulanini,3,',','.') }}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    </tr>
                @else
                    <tr style="border: 1px solid black;">
                        <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;">{{$pm->text}}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px;">{{ number_format($pm->totalbulanlalu,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; ">{{ number_format($pm->totalbulanlalu + $pm->totalbulanini,3,',','.') }}</td>
                        <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    </tr>
                @endif
                @endforeach
                <tr style="border: 1px solid black;">
                    <td colspan = "2" align="left" width="50" style="padding: 10px; font-size: 15px; "><b>Jumlah Pengeluaran (SPJ Netto + Potongan/Pajak - Pengembalian)</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalugaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninigaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format($total[0]->jumlahspjsdbulanlalubarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahspjbulaninibarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format(0,0,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->totalsemuabulangaji + $total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>{{ number_format($total[0]->jumlahanggaran - $total[0]->totalsemuabulangaji - $total[0]->totalsemuabulanbarangjasa,3,',','.') }}</b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px;"><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" height="40" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                </tr>
                <tr style="border: 1px solid black;">
                    <td colspan="2" align="left" width="50" style="padding: 10px; padding-left: 30px; font-size: 15px;"><b>Saldo Kas</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b></b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px;"><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                    <td align="right" width="50" style="padding: 10px;  font-size: 15px; "><b>0</b></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 50px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" style="padding: 10px; font-size: 15px;  "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; font-weight: bold;">Bendahara Pengeluaran Pembantu</td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 150px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  font-weight: bold;">Paula Sofyanita, SE.</td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: -20px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  font-weight: bold;">NIP. 19910622 201502 2 002</td>
                </tr>
        </table>
</div>
<script>
    window.print()
</script>
</body>
</html>