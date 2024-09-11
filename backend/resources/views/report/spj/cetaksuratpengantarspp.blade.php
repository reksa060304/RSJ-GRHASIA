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
    <table  cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="height: 700px;padding-right: 70px;padding-left: 100px;">
        <tbody>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:20px;"></td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="left">
                <font style="font-size: 14pt" color="#000000">SPP UP</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:20px;"></td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt" color="#000000">SURAT PERMINTAAN PEMBAYARAN UANG PERSEDIAAN (SPP-UP)</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="center">
                <font style="font-size: 14pt" color="#000000">NOMOR: {{$detail[0]->nospp}} Tahun {{ date('Y', strtotime($detail[0]->tglspp)) }}</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt" color="#000000">SURAT PENGANTAR</font>
            </td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="3" style="padding-right: 100px; text-align:left; padding-bottom: 5px;">
                <font style="font-size: 12pt" color="#000000"><br><br>
                    Kepada Yth :<br>
                    Pengguna Anggaran<br>
                    RS Jiwa GRHASIA DINKES DIY<br><br>
                    Di tempat
                </font>
            </td>
            <td colspan="1" style="padding-right: 100px; text-align:left; padding-bottom: 5px;">
            </td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:justify; padding-bottom: 10px; padding-top: 10px; ">
            <br>
                <font style="font-size: 12pt" color="#000000">Dengan memperhatikan Peraturan Gubernur Nomor 114 Tahun 2020 tentang Penjabaran Anggaran
                Pendapatan dan Belanja Daerah Tahun Anggaran {{ date('Y', strtotime($detail[0]->tglspp)) }}, bersama ini kami mengajukan Surat
                Permintaan Pembayaran Uang Persediaan sebagai berikut :</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:30px;"></td>
        </tr>
        </tbody>
        <tbody style="padding-right: 50px; padding-left: 50px;">
        
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left">a. Urusan Pemerintahan</td>
            <td colspan="4" style="padding: 5px;" align="left">: URUSAN PEMERINTAHAN BIDANG KESEHATAN</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left">b. SKPD</td>
            <td colspan="4" style="padding: 5px;" align="left">: RS Jiwa GRHASIA DINKES DIY</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left">c. Tahun Anggaran</td>
            <td colspan="4" style="padding: 5px;" align="left">: {{ date('Y', strtotime($detail[0]->tglspp)) }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left">d. Dasar Pengeluaran SPD Nomor</td>
            <td colspan="4" style="padding: 5px;" align="left">: </td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left">e. Jumlah SPD</td>
            <td colspan="4" style="padding: 5px;" align="left">: </td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left"></td>
            <td colspan="4" style="padding: 5px;" align="left">terbilang : GIA rupiah</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left">f. Nama Bendahara Pengeluaran</td>
            <td colspan="4" style="padding: 5px;" align="left">: Christina Dewi Isti Paramita, S.E.</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left">g. Jumlah Pembayaran Yang Diminta</td>
            <td colspan="4" style="padding: 5px;" align="left">: Rp {{ number_format($detail[0]->nilaispp,2,',','.') }}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left"></td>
            <td colspan="4" style="padding: 5px;" align="left">terbilang : {{$terbilang}}</td>
        </tr>
        <tr style="padding: 5px;">
            <td colspan="1" style="padding: 5px;" align="left">h. Nama dan Nomor Rekening Bank</td>
            <td colspan="4" style="padding: 5px;" align="left">: BPD DIY, Rekening : 041111000044</td>
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