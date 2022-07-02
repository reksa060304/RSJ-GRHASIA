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
</style>
<body style="background-color: #CCCCCC">
<div align="center">
    <section>
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}">
        <tbody>
        <tr>
            <td colspan="2" style="padding: 30px; text-align:left">
                <b>
                    <font style="font-size: 12pt" color="#000000">Lembar : I/II/III/IV/V</font>
                </b> 
            </td>
            <td colspan="2" style="padding-right: 30px" align="right">
                <b>
                    <font style="font-size: 12pt" color="#000000">Model : Bend. 26. a</font>
                </b> 
            </td>
        </tr>
        <tr>
            <td colspan="4" style="padding: 10px" align="center">
                <b>
                    <font style="font-size: 14pt" color="#000000"><u> BUKTI KAS PENGELUARAN </u></font>
                </b> 
            </td>
        </tr>
        <tr>
            <td style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 15px;">
                <font style="font-size: 12pt" color="#000000">Terima dari</font>
            </td>
            <td style="padding: 10px; padding-bottom: 5px; padding-top: 5px;" align="left">
                <font style="font-size: 12pt" color="#000000">: Direktur RS Jiwa GRHASIA DINKES DIY</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 5px;">
                <font style="font-size: 12pt" color="#000000">Uang Sebesar</font>
            </td>
            <td style="padding: 10px; padding-bottom: 5px; padding-top: 5px;" align="left">
                <font style="font-size: 12pt" color="#000000">: {{$jumlah[0]->totalfix}}</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 55px;">
                <font style="font-size: 12pt" color="#000000">Yaitu untuk membayar: </font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 10px;">
                <font style="font-size: 12pt" color="#000000">{{$keterangan[0]->keteranganbelanja}} ({{$mataanggaran[0]->kodemataanggaran}}) pada sub kegiatan {{ $kegiatan[0]->ktsub }} sub sub kegiatan {{ $kegiatan[0]->ktsubsub }} dengan rincian biaya terlampir.</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 40px;">
                <font style="font-size: 12pt" color="#000000">Terbilang: {{$terbilang}}</font>
            </td>
        </tr>
        <tr>
            <td colspan="4" style="text-align:right; padding-right: 50px; padding-bottom: 5px; padding-top: 30px;">
                <font style="font-size: 12pt" color="#000000">Yogyakarta, &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; {{$kegiatan[0]->tahun}}</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">Mengetahui dan Menyetujui</font>
            </td>
            <td style="width: 100px;"></td>
            <td style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000">Yang menerima,</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 120px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">Direktur Selaku KPA</font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 80px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">Bendahara Pengeluaran</font>
            </td>
            <td style="padding: 10px; padding-bottom: 100px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000">Tanda Tangan</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"><u>dr.  Akhmad Akhadi Stamsudhuha, M.P.H</u></font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 80px;">
                <font style="font-size: 12pt" color="#000000"><u>{{ $spj[0]->namabendahara}}</u></font>
            </td>
            <td style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000"><u>{{ $spj[0]->namapenerima}}</u></font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">NIP. 19680714 200012 1 002</font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; width: 80px;">
                <font style="font-size: 12pt" color="#000000">{{ $spj[0]->nipbendahara}}</font>
            </td>
            <td style="padding: 10px; padding-bottom: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 0px; width: 120px; border-top: 4px solid black; ">
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 0px; width: 80px; border-top: 4px solid black">
            </td>
            <td style="padding: 10px; padding-bottom: 0px; width: 100px; border-top: 4px solid black"" align="center">
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: -5px; width: 120px; border-top: 2px solid black; ">
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: -5px; width: 80px; border-top: 2px solid black; border-left: 2px solid black">
            </td>
            <td style="padding: 10px; padding-bottom: 5px; padding-top: -5px; width: 100px; border-top: 2px solid black; border-left: 2px solid black"" align="center">
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt" color="#000000">Telah dipungut:</font>
            </td>
            <td style="padding: 10px; width: padding-left: 30px; 100px; border-left: 2px solid black" align="center">
                <font style="font-size: 12pt" csolor="#000000">Telah dibukukan:</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"> Barang tersebut telah diterima dengan cukup dan baik
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt" color="#000000">PPn&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: {{ $spj[0]->ppn }}</font>
            </td>
            <td style=" width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                <font style="font-size: 12pt" csolor="#000000">BK Tgl. ..............No...............</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 80px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt" color="#000000"><u>PPh&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: {{ $spj[0]->pph }}</u></font>
            </td>
            <td style="width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                <font style="font-size: 12pt" csolor="#000000">No. Rek: {{$mataanggaran[0]->kodemataanggaran}}</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000">PPh&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: {{ $spj[0]->totalpp }}</font>
            </td>
            <td style="width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                <font style="font-size: 12pt" csolor="#000000">Kode Kegiatan: {{$kegiatan[0]->kodesub}}</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 30px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; padding-bottom: 30px;  width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000"></font>
            </td>
            <td style="width: 100px; padding-left: 30px; padding-bottom: 30px; border-left: 2px solid black" align="left">
                <font style="font-size: 12pt" csolor="#000000">Tahun Anggaran: {{$kegiatan[0]->tahun}}</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; padding-bottom: 50px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000">Paraf</font>
            </td>
            <td style="width: 100px; padding-left: 30px; padding-bottom: 50px; border-left: 2px solid black" align="center">
                <font style="font-size: 12pt" csolor="#000000">Paraf</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"><u>dr. Rina Sugiyanti, SpKJ</u>
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000">(............................)</font>
            </td>
            <td style="text-align:center; padding-left: 30px; width: 100px; border-left: 2px solid black">
                <font style="font-size: 12pt" csolor="#000000">(............................)</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">123456789
                </font>
            </td>
            <td style="text-align:center; padding-left: 30px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000"></font>
            </td>
            <td style="text-align:center; padding-left: 30px; width: 100px; border-left: 2px solid black">
                <font style="font-size: 12pt" csolor="#000000"></font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 10px; padding-top: 80px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">{{$spj[0]->norealisasi}}</font>
            </td>
            <td style="width: 100px; padding-top: 80px;"></td>
            <td style="padding-top: 80px; width: 100px;" align="center">
            </td>
        </tr>
        </tbody>
    </table>
</section>
<section>
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="padding-left: 80px; padding-right: 80px;">
    <tbody>
        <tr>
            <td colspan="4" style="padding-left: 120px; padding-top: 50px; padding-bottom: 0px; " align="center">
                <b>
                    <font style="font-size: 14pt" color="#000000">LAMPIRAN SPJ RS Jiwa GRHASIA DINKES DIY</font>
                </b> 
            </td>
        </tr>
        <tr>
            <td colspan="4" style="padding-left: 120px; padding-top: 5px; padding-bottom: 0px; " align="center">
                <b>
                    <font style="font-size: 14pt" color="#000000">Nomor: {{$spj[0]->norealisasi}}</font>
                </b> 
            </td>
        </tr>
        <tr>
            <td colspan="4" style="padding-left: 120px; padding-top: 5px; padding-bottom: 50px; " align="center">
                <b>
                    <font style="font-size: 14pt" color="#000000">{{$kegiatan[0]->ktsub}}: {{$mataanggaran[0]->kodemataanggaran}} - {{$keterangan[0]->keteranganbelanja}}</font>
                </b> 
            </td>
        </tr>
        </tbody>

        <tbody style="padding-left: 50px; padding-right: 50px;">
        <tr style="border: 1px solid black" >
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px;" align="center">
                NO.
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px;" align="center">
                NAMA BARANG
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px;" align="center">
                HARGA SATUAN
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px;" align="center">
                JUMLAH
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px;" align="center">
                SUB TOTAL
            </td>
        </tr>
        </tbody>
        <tbody style="padding-left: 50px; padding-right: 50px;">
            @foreach($detail as $dt)
        <tr style="border: 1px solid black" >
            <td style="padding: 10px;  border: 1px solid black; width: 50px; height: 20px;" align="center">
                NO.
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px; " align="center">
                {{$dt->uraian}}
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px; " align="center">
                {{$dt->harga}}
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px; " align="center">
                {{$dt->jml}}
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px; " align="center">
                {{$dt->subtotal}}
            </td>
            @endforeach
        </tr>
        <tr style="border: 1px solid black" >
            <td colspan="4" style="padding: 10px; border: 1px solid black; width: 200px; " align="center">
                JUMLAH TOTAL
            </td>
            <td style="padding: 10px; width: 50px; border: 1px solid black " align="center">
                {{ $jumlah[0]->totalfix }}
            </td>
        </tr>
        <tr style="border: 1px solid black;" >
            <td colspan="4" style="padding: 10px; border: 1px solid black " align="center">
                JUMLAH TOTAL (PEMBULATAN)
            </td>
            <td style="padding: 10px; width: 50px; border: 1px solid black " align="center">
            {{ $jumlah[0]->totalpembulatan }}
            </td>
        </tr>
        <tr>
            <td style="text-align:center; width: 200px; padding-top: 50px;" align="right>
                    <font style="font-size: 12pt" csolor="#000000"></font>
                </td>
                <td style="text-align:center; width: 200px; padding-top: 50px;" align="right>
                    <font style="font-size: 12pt" csolor="#000000"></font>
                </td>
                <td style="text-align:center; width: 300px; padding-top: 50px;" align="right>
                    <font style="font-size: 12pt" csolor="#000000">Yogyakarta,&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Juni {{$kegiatan[0]->tahun}}</font>
                </td>
            </tr>
            <tr>
            <td style="text-align:center; width: 200px; " align="right>
                    <font style="font-size: 12pt" csolor="#000000"></font>
                </td>
                <td style="text-align:center; width: 200px; " align="right>
                    <font style="font-size: 12pt" csolor="#000000"></font>
                </td>
                <td style="text-align:center; width: 300px; " align="right>
                    <font style="font-size: 12pt" csolor="#000000">Yang Meneriman, <br> Tanda Tangan</font>
                </td>
            </tr>
            <td style="text-align:center; width: 200px; padding-top: 100px;" align="right>
                    <font style="font-size: 12pt" csolor="#000000"></font>
                </td>
                <td style="text-align:center; width: 200px; padding-top: 100px;" align="right>
                    <font style="font-size: 12pt" csolor="#000000"></font>
                </td>
                <td style="text-align:center; width: 300px;padding-top: 100px; " align="right>
                    <font style="font-size: 12pt" csolor="#000000"><u>{{$spj[0]->namapenerima}}</u></font>
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