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
                <font style="font-size: 14pt" color="#000000">SURAT PENGANTAR SPM</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="center">
                <font style="font-size: 14pt" color="#000000">NOMOR: <b>{{$detail[0]->nospm}}</b></font>
            </td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="3"></td>
            <td colspan="1" style="padding-right: 100px; text-align:left; padding-bottom: 5px;">
                <font style="font-size: 12pt" color="#000000"><br><br>
                    Kepada Yth :<br>
                    Kepala Badan Pengelola Keuangan dan Aset<br>
                    Daerah Istimewa Yogyakarta<br>
                    Selaku Bendahara Umum Daerah<br>
                    di<br>
                    <u>Y O G Y A K A R T A</u>
                </font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:justify; padding-bottom: 10px; padding-top: 10px; ">
            <br><br>
                <font style="font-size: 12pt" color="#000000">Bersama ini kami sampaikan SPM-UP Nomor {{$detail[0]->nospm}} Tanggal {{ $tgl }} mohon untuk diterbitkan SP2D sebesar
                Rp {{ number_format($detail[0]->nilaispm,2,',','.') }} ({{ $terbilang }}) atas nama Paula Sofyanita, SE..
                Bendahara Pengeluaran, alamat Yogyakarta untuk pencairan dana Pengajuan Uang Persediaan RS Jiwa GRHASIA DINKES
                DIY Tahun Anggaran {{ date('Y', strtotime($detail[0]->tglspm)) }}</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:50px;"></td>
        </tr>
        </tbody>
        <tbody class="tabel" style="padding-right: 50px; padding-left: 50px;">
        
        <tr style="padding: 5px;">
            <td style="padding: 5px;" align="center">No</td>
            <td style="padding: 5px;" align="center">Kode Rekening</td>
            <td style="padding: 5px;" align="center">Uraian</td>
            <td style="padding: 5px;" align="center">Jumlah</td>
        </tr>
        @foreach($detail AS $dt)
        <tr style="padding: 5px;">
            <td style="padding: 5px; width: 100px;" align="center">
                1
            </td>
            <td style="padding: 5px;" align="left">
                1.02.2.22.0.00.01.0004
            </td>
            <td style="padding: 5px;" align="left">
                {{$dt->untukpengeluaran}}
            </td>
            <td style="padding: 5px;" align="center">
                {{ number_format($dt->nilaispm,2,',','.') }}
            </td>
        </tr>
        @endforeach
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:100px;"></td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px;height:200px;width: 100px;" align="left">CATATAN:<br><br><br><br><br><br><br><br><br><br><br><br></td>
            <td style="padding: 5px;height:200px;" align="left" colspan="2">
                Telah diterima:<br>
                Badan Pengelolaan Keuangan dan Aset DIY<br><br><br><br><br><br><br><br><br>
                Nama :<br>
                Tanggal :
            </td>
            <td style="padding: 5px;height:200px;" align="center" colspan="2">
                YOGYAKARTA,{{$tgl}}<br>
                Direktur<br><br><br><br><br><br><br><br><br>
                dr. Akhmad Akhadi Syamsudhuha, M.P.H<br>
                NIP. 19680714 200012 1 002<br>
            </td>
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