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
                <font style="font-size: 14pt" color="#000000">SURAT PERNYATAAN TANGGUNG JAWAB BELANJA</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="center">
                <font style="font-size: 14pt" color="#000000">PENGGUNA ANGGARAN/ KUASA PENGGUNA ANGGARAN</b></font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt" color="#000000">NOMOR :</font>
            </td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="5" style="text-align:justify; padding-bottom: 10px; padding-top: 10px; ">
            <br><br>
                <font style="font-size: 12pt" color="#000000">Sehubungan dengan Surat Perintah Membayar Uang Persediaan (SPM-UP) Nomor {{$detail[0]->nospm}} Tanggal {{ $tgl }} yang kami ajukan sebesar
                Rp {{ number_format($detail[0]->nilaispm,2,',','.') }} ({{ $terbilang }}) untuk keperluan RS Jiwa GRHASIA DINKES DIY Tahun Anggaran {{ date('Y', strtotime($detail[0]->tglspm)) }}, dengan ini menyatakan dengan sebenar-benarnya bahwa :</font>
            </td>
        </tr>
        <tr>
            <td colspan="1"></td>
            <td colspan="1"><br>1.</td>
            <td colspan="3" style="text-align:justify; ">
            <br><br>
                <font style="font-size: 12pt; margin-top:-10px;" color="#000000">Jumlah SPM - Uang Persediaan (UP) tersebut diatas akan dipergunakan untuk keperluan guna
                membiayai kegiatan yang akan kami laksanakan sesuai DPA-SKPD ;</font>
            </td>
        </tr>
        <tr>
            <td colspan="1"></td>
            <td colspan="1">2.</td>
            <td colspan="3" style="text-align:justify;">
            <br><br>
                <font style="font-size: 12pt" color="#000000">Jumlah SPM - Uang Persediaan (UP) tersebut tidak akan digunakan untuk membiayai pengeluaran
                - pengeluaran yang menurut ketentutan yang berlaku harus dilakukan dengan Pembayaran
                Langsung (LS)</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:justify; padding-bottom: 10px; padding-top: 10px; ">
            <br><br>
                <font style="font-size: 12pt" color="#000000">Demikian Surat Pernyataan ini dibuat untuk melengkapi persyaratan penerbitan SP2D-UP SKPD kami</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:50px;"></td>
        </tr>
        </tbody>
        <tbody style="padding-right: 50px; padding-left: 50px;">
        <tr style="padding: 5px;">
            <td style="padding: 5px;height:200px;width: 100px;" align="left"></td>
            <td style="padding: 5px;height:200px;" align="left" colspan="3"></td>
            <td style="padding: 5px;height:200px;" align="center" colspan="1">
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