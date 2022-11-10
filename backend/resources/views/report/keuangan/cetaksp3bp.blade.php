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
        margin: 2cm 2cm 2cm 3cm;  /* this affects the margin in the printer settings */
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
    <table  class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="height: 700px;">
        <tbody>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt; font-weight: bold;" color="#000000">PEMERINTAH DAERAH DAERAH  ISTIMEWA YOGYAKARTA <br> RS JIWA GRHASIA DIY</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="center">
                <font style="font-size: 14pt; font-weight: bold;" color="#000000">SURAT PERMINTAAN PENGESAHAN PENDAPATAN, BELANJA DAN PEMBIAYAAN <br> BADAN LAYANAN UMUM DAERAH</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt" color="#000000">Tanggal: {{$tanggal}} &emsp;&emsp;&emsp; Nomor : 900/23517</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:20px;"></td>
        </tr>
        <tr>
            <td colspan="5" align="left">
                <font style="font-size: 12pt" color="#000000">Direktur RS Jiwa Grhasia DIY memohon kepada :</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="left">
                <font style="font-size: 12pt" color="#000000">Bendahara umum daerah selaku PPKD</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" align="left">
                <font style="font-size: 12pt" color="#000000">agar mengesahkan dan membukukan pendapatan, belanja dan pembiayaan sejumlah</font>
            </td>
        </tr>
        </tbody>
        <tbody>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:30px;"></td>
        </tr>
        <tr>
            <td colspan="1" align="left">
                <font style="font-size: 12pt" color="#000000">1. Saldo Awal</font>
            </td>
            <td colspan="1">Rp</td>
            <td colspan="1" align="right">
                <font style="font-size: 12pt" color="#000000">{{ number_format($saldoawal,2,',','.') }}</font>
            </td>
        </tr>
        <tr>
            <td colspan="1" align="left">
                <font style="font-size: 12pt" color="#000000">2. Pendapatan</font>
            </td>
            <td colspan="1">Rp</td>
            <td colspan="1" align="right">
                <font style="font-size: 12pt" color="#000000">{{ number_format($penerimaan[0]->jumlahpenerimaan,2,',','.') }}</font>
            </td>
        </tr>
        <tr>
            <td colspan="1" align="left">
                <font style="font-size: 12pt" color="#000000">3. Belanja</font>
            </td>
            <td colspan="1">Rp</td>
            <td colspan="1" align="right">
                <font style="font-size: 12pt" color="#000000">{{ number_format($totalbelanja,2,',','.') }}</font>
            </td>
        </tr>
        <tr>
            <td colspan="1" align="left">
                <font style="font-size: 12pt" color="#000000">4. Saldo Akhir</font>
            </td>
            <td colspan="1">Rp</td>
            <td colspan="1" align="right">
                <font style="font-size: 12pt" color="#000000">{{ number_format($saldoawal + $penerimaan[0]->jumlahpenerimaan - $totalbelanja,2,',','.') }}</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:30px;"></td>
        </tr>
        </tbody>
        <tbody class="tabel">
        <tr>
            <td style="padding: 5px; width: 100px;" align="center">Untuk bulan {{ $periode }}</td>
            <td colspan="3" style="padding: 5px;" align="center">Tahun Anggaran {{ $tahun }}</td>
        </tr>
        <tr>
            <td style="padding: 5px; width: 100px;" align="left">Dasar pengesahan :</td>
            <td style="padding: 5px;" align="center">Urusan</td>
            <td style="padding: 5px;" align="center">Organisasi</td>
            <td style="padding: 5px;" align="center">Nama BLUD</td>
        </tr>
        <tr>
            <td style="padding: 5px; width: 100px;" align="left">Perda APBD Nomor 8 Tahun 2021 Tanggal 31 Desember 2021</td>
            <td rowspan="2" style="padding: 5px;" align="center">1.02</td>
            <td rowspan="2" style="padding: 5px;" align="center">1.02.2.22.0.00.01.0004</td>
            <td rowspan="2" style="padding: 5px;" align="center">RUMAH SAKIT JIWA GRHASIA DIY</td>
        </tr>
        <tr>
            <td style="padding: 5px;" align="left">DPPA/A.2/1.02.2.22.0.00.01.0004/001/2022 Tanggal 12 Juli 2022</td>
        </tr>
        <tr>
            <td align="center" colspan="5" style="padding: 5px;">Program Kegiatan</td>
        </tr>
        </tbody>
        <tbody>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:30px;"></td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt;" color="#000000">1.02.01 PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH PROVINSI</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt;" color="#000000">1.02.01.1.10 Peningkatan Pelayanan BLUD</font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <font style="font-size: 14pt;" color="#000000">1.02.01.1.10.01 Pelayanan dan Penunjang Pelayanan BLUD</font>
            </td>
        </tr>
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:30px;"></td>
        </tr>
        </tbody>
        <tbody class="tabel">
        <tr>
            <td colspan="2" style="padding: 5px;" align="center">Pendapatan</td>
            <td colspan="2" style="padding: 5px;" align="center">Belanja</td>
        </tr>
        <tr>
            <td style="padding: 5px;" align="center">Kode Rekening</td>
            <td style="padding: 5px;" align="center">Jumlah</td>
            <td style="padding: 5px;" align="center">Kode Rekening</td>
            <td style="padding: 5px;" align="center">Jumlah</td>
        </tr>
        <!-- foreach -->
        <tr>
            <td style="padding: 5px;" align="center">4.1.04.16.01.0001</td>
            <td style="padding: 5px;" align="center">{{ number_format($penerimaan[0]->jumlahpenerimaan,2,',','.') }}</td>
            @if(!empty($belanja))
            <td style="padding: 5px;" align="center">{{ $belanja[0]->kodepermendagri }}</td>
            <td style="padding: 5px;" align="center">{{ $belanja[0]->jumlahbelanja }}</td>
            @else
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="center"></td>
            @endif
        </tr>
        @if(!empty($belanja))
        @foreach($belanja as $bj)
        @if($bj->kodepermendagri != $belanja[0]->kodepermendagri)
        <tr>
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="center">{{ $bj->kodepermendagri }}</td>
            <td style="padding: 5px;" align="center">{{ $bj->jumlahbelanja }}</td>
        </tr>
        @endif
        @endforeach
        @else
        <tr>
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="center"></td>
        </tr>
        @endif
        <!-- endforeach -->
        <tr>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
        </tr>
        <tr>
            <td style="padding: 5px;" align="center">Jumlah Pendapatan</td>
            <td style="padding: 5px;" align="center">{{ number_format($penerimaan[0]->jumlahpenerimaan,2,',','.') }}</td>
            <td style="padding: 5px;" align="center">Jumlah Belanja</td>
            <td style="padding: 5px;" align="center">{{ number_format($totalbelanja,2,',','.') }}</td>
        </tr>
        </tbody>
        <tbody style="padding-right: 50px; padding-left: 50px;">
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:50px;"></td>
        </tr>
        </tbody>
        <tbody class="tabel">
        <tr>
            <td colspan="2" style="padding: 5px;" align="center">Penerimaan Pembiayaan</td>
            <td colspan="2" style="padding: 5px;" align="center">Pengeluaran Pembiayaan</td>
        </tr>
        <tr>
            <td style="padding: 5px;" align="center">Kode Rekening</td>
            <td style="padding: 5px;" align="center">Jumlah</td>
            <td style="padding: 5px;" align="center">Kode Rekening</td>
            <td style="padding: 5px;" align="center">Jumlah</td>
        </tr>
        <tr>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
        </tr>
        <tr>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
            <td style="padding: 5px; height:30px;" align="center"></td>
        </tr>
        <tr>
            <td style="padding: 5px;" align="center">Jumlah Penerimaan Pembiayaan</td>
            <td style="padding: 5px;" align="center"></td>
            <td style="padding: 5px;" align="center">Jumlah Pengeluaran Pembiayaan</td>
            <td style="padding: 5px;" align="center"></td>
        </tr>
        </tbody>



        <tbody style="padding-right: 50px; padding-left: 50px;">
        <tr style="padding: 5px;">
            <td align="center" colspan="4" style="padding: 5px;height:70px;"></td>
        </tr>
        <tr style="padding: 5px;">
            <td style="padding: 5px;height:200px;width: 100px;" align="left" colspan="2"></td>
            <td style="padding: 5px;height:200px;" align="center" colspan="2">
                YOGYAKARTA, {{ $tanggalcetak }}<br>
                Direktur RS Jiwa Grhasia DIY<br><br><br><br><br><br><br><br><br>
                <u>(dr. AKHMAD AKHADI S., M.P.H)</u><br>
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