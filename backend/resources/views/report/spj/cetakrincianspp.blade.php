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
                <font style="font-size: 14pt" color="#000000">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="center">
                <font style="font-size: 14pt" color="#000000">SURAT PERMINTAAN PEMBAYARAN UANG PERSEDIAAN (SPP-UP)</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="center">
                <font style="font-size: 14pt" color="#000000">NOMOR: {{$detail[0]->nospp}} Tahun {{ date('Y', strtotime($detail[0]->tglspp)) }}</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:50px;"></td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt" color="#000000">RINCIAN RENCANA PENGGUNAAN</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:20px;"></td>
        </tr>
        </tbody>
        <tbody class="tabel">
        <tr style="padding: 5px;">
            <td style="padding: 5px;" align="center">No</td>
            <td style="padding: 5px;" align="center">Kode Rekening</td>
            <td style="padding: 5px;" align="center">Uraian</td>
            <td style="padding: 5px;" align="center">Jumlah</td>
        </tr>
        @foreach($permen as $pr)
        <tr style="padding: 5px;">
            <td style="padding: 5px;" align="center">{{$pr->nomor}}</td>
            <td style="padding: 5px;" align="left">{{$pr->kode}}</td>
            <td style="padding: 5px;" align="left">{{$pr->mataanggaranpermen}}</td>
            <td style="padding: 5px;" align="center"></td>
        </tr>
        @endforeach
        </tbody>
        <tbody>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:10px;"></td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="right">TOTAL</td>
            <td style="padding: 5px;" align="left">: Rp {{ number_format($detail[0]->nilaispp,2,',','.') }}</td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:justify; padding-bottom: 10px; padding-top: 10px; ">
            <br>
                <font style="font-size: 12pt" color="#000000">Terbilang : # {{$terbilang}} #</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:70px;"></td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px;height:200px;width: 100px;" align="left"></td>
            <td style="padding: 5px;height:200px;" align="left" colspan="2"></td>
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