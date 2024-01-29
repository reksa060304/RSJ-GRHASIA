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
    @page {   /* auto is the initial value */
        margin: 0;  /* this affects the margin in the printer settings */
    }
</style>
<style>
    tr td {
        padding: 2px 4px 2px 4px;
    }

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

    .tabel2 tr td{
        border: none;
    }
</style>
<body style="background-color: #CCCCCC">
<div align="center" >
    <section >
    <table  class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="height: 700px;padding-right: 70px;padding-left: 100px;">
        <tbody>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:50px;"></td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt" color="#000000">REGISTER PENUTUPAN KAS</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="center">
                <font style="font-size: 14pt" color="#000000">BLUD</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:50px;"></td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="5" style="padding-right: 100px; text-align:left; padding-bottom: 5px;">
                <table cellspacing="0" cellpadding="0" class="tabel2">
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="left">
                        Tanggal Penutupan Kas
                        </td>
                        <td class="child" colspan="3" style="padding: 5px;" align="left">
                        : {{$indakhirbulanini}}
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="left">
                        Nama Penutup Kas
                        </td>
                        <td class="child" colspan="3" style="padding: 5px;" align="left">
                        : Christina Dewi Isti Paramita, S.E.
                        </td>
                    </tr>
                    <tr>
                        <td class="child" colspan="2" style="padding: 5px;" align="left">
                        Tanggal Penutupan Kas Yang Lalu
                        </td>
                        <td class="child" colspan="3" style="padding: 5px;" align="left">
                        : {{$indakhirbulanlalu}}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="left">JML PENERIMAAN SD</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">{{ number_format($data[0]->penerimaan,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="left">JML PENGELUARAN SD</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">{{ number_format($data[0]->pengeluaran,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="right">Saldo Buku</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">{{ number_format($data[0]->penerimaan - $data[0]->pengeluaran,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="right">Saldo Kas</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">{{ number_format($data[0]->penerimaan - $data[0]->pengeluaran,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:20px;"></td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="5" style="padding: 5px;" align="left">Terdiri atas :</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="left">(1) Lembar &emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp; Uang Kertas</td>
            <td colspan="2" style="padding: 5px;" align="right">Rp. {{ number_format(0,0,',','.') }}  &emsp;&emsp;&emsp;&emsp;&emsp; 0</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp. {{ number_format(0,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="left">Jumlah Uang Kertas</td>
            <td colspan="2" style="padding: 5px;" align="right"></td>
            <td colspan="1" style="padding: 5px;" align="right">Rp. {{ number_format(0,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="left">(1) Kepingan &nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp; Uang Logam</td>
            <td colspan="2" style="padding: 5px;" align="right">Rp. {{ number_format(0,0,',','.') }}  &emsp;&emsp;&emsp;&emsp;&emsp; 0</td>
            <td colspan="1" style="padding: 5px;" align="right">Rp. {{ number_format(0,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="left">Jumlah Uang Logam</td>
            <td colspan="2" style="padding: 5px;" align="right"></td>
            <td colspan="1" style="padding: 5px;" align="right">Rp. {{ number_format(0,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:20px;"></td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="5" style="padding: 5px;" align="left">(3) Kertas berharga dan bagian kas yang diijinkan</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="5" style="padding: 5px;" align="left">ordonasi / SP2D, Wesel, Cek, Saldo Bank,</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="left">Materai, dan sebagainya .............................</td>
            <td colspan="2" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">{{ number_format($data[0]->penerimaan - $data[0]->pengeluaran,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="2" style="padding: 5px;" align="right">Total</td>
            <td colspan="2" style="padding: 5px;" align="right">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="right">{{ number_format($data[0]->penerimaan - $data[0]->pengeluaran,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:20px;"></td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="3" style="padding: 5px;" align="left">Perbedaan selisih lebih / kurang</td>
            <td colspan="1" style="padding: 5px;" align="left">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="left">{{ number_format(0,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="5" style="padding: 5px;" align="left">Terdiri dari :</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left"></td>
            <td colspan="2" style="padding: 5px;" align="left">&emsp;&emsp;Uang muka kerja</td>
            <td colspan="1" style="padding: 5px;" align="left">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="left">{{ number_format(0,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left"></td>
            <td colspan="2" style="padding: 5px;" align="left">&emsp;&emsp;Kesulitan uang kecil</td>
            <td colspan="1" style="padding: 5px;" align="left">Rp.</td>
            <td colspan="1" style="padding: 5px;" align="left">{{ number_format(0,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:50px;"></td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px;height:200px;" align="center" colspan="1"></td>
            <td style="padding: 5px;height:200px;" align="center" colspan="1">
                Mengetahui<br>
                Pimpinan BLUD RS Jiwa Grhasia DIY<br><br><br><br><br><br><br><br><br>
                dr. Akhmad Akhadi Syamsudhuha, M.P.H<br>
                NIP. 19680714 200012 1 002<br>
            </td>
            <td style="padding: 5px;height:200px;" align="center" colspan="2"></td>
            <td style="padding: 5px;height:200px;" align="center" colspan="1">
                YOGYAKARTA, {{$tanggalcetak}}<br>
                Bendahara Pengeluaran<br><br><br><br><br><br><br><br><br>
                Christina Dewi Isti Paramita, S.E.<br>
                NIP. 19841027 201502 2 001<br>
            </td>
            <td style="padding: 5px;height:200px;" align="center" colspan="1"></td>
        </tr>
        </tbody>
        
    </table>
</section>
</div>
<script>
    window.print()
</script>
</body>
</html>