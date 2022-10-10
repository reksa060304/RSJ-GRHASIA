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
        bottom: 50;
    }
    .page-break {
        page-break-after: always;
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
    <section class="page-break">
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" height="500">
    <tbody>
        <tr>
            <td colspan="2" style="padding: 30px; text-align:left">
                <b>
                    <font style="font-size: 12pt" color="#000000">Lembar : I/II/III/IV/V</font>
                </b> 
            </td>
            <td style="padding-right: 30px" align="right"></td>
            <td colspan="2" style="padding-right: 30px" align="right">
                <b>
                    <font style="font-size: 12pt" color="#000000">Model : Bend. 26. a</font>
                </b> 
            </td>
        </tr>
        <tr>
            <td colspan="5" style="padding: 10px" align="center">
                <b>
                    <font style="font-size: 14pt" color="#000000"><u> BUKTI KAS PENGELUARAN </u></font>
                </b> 
            </td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="1" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 15px;">
                <font style="font-size: 12pt" color="#000000">Terima dari</font>
            </td>
            <td colspan="4" style="padding: 10px; padding-bottom: 5px; padding-top: 5px;" align="left">
                <font style="font-size: 12pt" color="#000000">: Direktur RS Jiwa GRHASIA DINKES DIY</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 5px;">
                <font style="font-size: 12pt" color="#000000">Uang Sebesar</font>
            </td>
            <td colspan="4" style="padding: 10px; padding-bottom: 5px; padding-top: 5px;" align="left">
                <font style="font-size: 12pt" color="#000000">: {{ $terbilang }}</font>
            </td>
        </tr>
        <tr>
            <td colspan="4" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 10px;">
                <font style="font-size: 12pt" color="#000000">Yaitu untuk membayar: </font>
            </td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:left; padding-left: 50px; padding-bottom: 10px; padding-top: 10px; ">
                <font style="font-size: 12pt" color="#000000">{{$keterangan[0]->keteranganbelanja}} ({{$kegiatan[0]->kodesub}}) pada sub kegiatan {{ $kegiatan[0]->ktsub }} sub sub kegiatan {{ $kegiatan[0]->ktsubsub }} dengan rincian biaya terlampir.</font>
            </td>
        </tr>
        </tbody>
        <tbody>
        <tr>
            <td colspan="2" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 10px;">
                <font style="font-size: 12pt" color="#000000">Terbilang: {{ number_format($jumlah[0]->totalfix,0,',','.') }}</font>
            </td>
        </tr>
        @if($kegiatan[0]->namalengkap != null && $tampilsumberdana == true)
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td style="width: 100px;"></td>
            <td colspan="2" style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000">Pejabat Pelaksana</font>
            </td>
        </tr>
        <tr>
            <td  colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 80px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 80px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td  colspan="2" style="padding: 10px; padding-bottom: 80px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000">Teknis Kegiatan (PPTK)</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 80px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td colspan="2" style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000"><u>{{ $kegiatan[0]->namalengkap}}</u></font>
            </td>
        </tr>
        <tr>
            <td  colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; width: 80px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td  colspan="2" style="padding: 10px; padding-bottom: 5px; width: 100px;" align="left">
                <font style="font-size: 12pt" color="#000000">&emsp;&nbsp;NIP. {{ $kegiatan[0]->nip_pns}}</font>
            </td>
        </tr>
        @endif
        <tr>
            <td colspan="5" style="text-align:right; padding-right: 50px; padding-bottom: 5px; padding-top: 30px;">
                <font style="font-size: 12pt" color="#000000">Yogyakarta, &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; {{$kegiatan[0]->tahun}}</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">Mengetahui dan Menyetujui</font>
            </td>
            <td style="width: 100px;"></td>
            <td colspan="2" style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000">Yang menerima,</font>
            </td>
        </tr>
        <tr>
            <td  colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 80px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">Direktur Selaku KPA</font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 80px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">Bendahara Pengeluaran</font>
            </td>
            <td  colspan="2" style="padding: 10px; padding-bottom: 80px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000">Tanda Tangan</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"><u>dr.  Akhmad Akhadi Stamsudhuha, M.P.H</u></font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 80px;">
                <font style="font-size: 12pt" color="#000000"><u>{{ $spj[0]->namabendahara}}</u></font>
            </td>
            <td colspan="2" style="padding: 10px; padding-bottom: 5px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000"><u>{{ $spj[0]->namapenerima}}</u></font>
            </td>
        </tr>
        <tr>
            <td  colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">NIP. 19680714 200012 1 002</font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; width: 80px;">
                <font style="font-size: 12pt" color="#000000">{{ $spj[0]->nipbendahara}}</font>
            </td>
            <td  colspan="2" style="padding: 10px; padding-bottom: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 0px; width: 120px; border-top: 4px solid black; ">
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 0px; width: 80px; border-top: 4px solid black">
            </td>
            <td colspan="2" style="padding: 10px; padding-bottom: 0px; width: 100px; border-top: 4px solid black"" align="center">
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: -5px; width: 120px; border-top: 2px solid black; ">
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: -5px; width: 80px; border-top: 2px solid black; border-left: 2px solid black">
            </td>
            <td colspan="2" style="padding: 10px; padding-bottom: 5px; padding-top: -5px; width: 100px; border-top: 2px solid black; border-left: 2px solid black"" align="center">
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt" color="#000000">Telah dipungut:</font>
            </td>
            <td colspan="2" style="padding: 10px; width: padding-left: 30px; 100px; border-left: 2px solid black" align="center">
                <font style="font-size: 12pt" csolor="#000000">Telah dibukukan:</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"> Barang tersebut telah diterima dengan cukup dan baik
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt" color="#000000">PPn&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: {{ $spj[0]->ppn }}</font>
            </td>
            <td colspan="2" style=" width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                <font style="font-size: 12pt" csolor="#000000">BK Tgl. ..............No...............</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 80px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt" color="#000000"><u>PPh&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: {{ $spj[0]->pph }}</u></font>
            </td>
            <td colspan="2" style="width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                <font style="font-size: 12pt" csolor="#000000">No. Rek: {{$mataanggaran[0]->kodemataanggaran}}</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000">PPh&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;: {{ $spj[0]->totalpp }}</font>
            </td>
            <td colspan="2" style="width: 100px; padding-left: 30px; border-left: 2px solid black" align="left">
                <font style="font-size: 12pt" csolor="#000000">Kode Kegiatan: {{$kegiatan[0]->kodesub}}</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 30px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; padding-bottom: 30px;  width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000"></font>
            </td>
            <td colspan="2" style="width: 100px; padding-left: 30px; padding-bottom: 30px; border-left: 2px solid black" align="left">
                <font style="font-size: 12pt" csolor="#000000">Tahun Anggaran: {{$kegiatan[0]->tahun}}</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; padding-bottom: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; padding-bottom: 50px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000">Paraf</font>
            </td>
            <td colspan="2" style="width: 100px; padding-left: 30px; padding-bottom: 50px; border-left: 2px solid black" align="center">
                <font style="font-size: 12pt" csolor="#000000">Paraf</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000"><u>dr. Rina Sugiyanti, SpKJ</u>
                </font>
            </td>
            <td style="text-align:center; padding-left: 0px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000">(............................)</font>
            </td>
            <td colspan="2" style="text-align:center; padding-left: 30px; width: 100px; border-left: 2px solid black">
                <font style="font-size: 12pt" csolor="#000000">(............................)</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:center; padding-left: 50px; width: 120px;">
                <font style="font-size: 12pt" color="#000000">19841125 201001 2 016
                </font>
            </td>
            <td style="text-align:center; padding-left: 30px; width: 80px; border-left: 2px solid black">
                <font style="font-size: 12pt;" color="#000000"></font>
            </td>
            <td colspan="2" style="text-align:center; padding-left: 30px; width: 100px; border-left: 2px solid black">
                <font style="font-size: 12pt" csolor="#000000"></font>
            </td>
        </tr>
        <tr>
            <td colspan="1" style="text-align:center; padding-left: 0px; padding-top: 100px; width: 100px;">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
            <td style="width: 100px; padding-top: 100px;"></td>
            <td colspan="2" style="padding-top: 100px; width: 100px;" align="center">
            </td>
        </tr>
        </tbody>
    </table>
    @include('template.footerspj')
</section>
<section class="page-break">
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="padding-left: 80px; padding-right: 80px;">
    <tbody>
        <tr>
            <td colspan="4" style="padding-left: 120px; padding-top: 50px; padding-bottom: 0px; " align="center">
                <b>
                    <font style="font-size: 14pt" color="#000000">LAMPIRAN SPJ RS Jiwa GRHASIA DINKES DIY</font>
                </b> 
            </td>
        </tr>
        <!-- <tr>
            <td colspan="4" style="padding-left: 120px; padding-top: 5px; padding-bottom: 0px; " align="center">
                <b>
                    <font style="font-size: 14pt" color="#000000">Nomor: {{$spj[0]->norealisasi}}</font>
                </b> 
            </td>
        </tr> -->
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
                {{ number_format($dt->harga,0,',','.') }}
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px; " align="center">
                {{ $dt->jml }}
            </td>
            <td style="padding: 10px; border: 1px solid black; width: 50px; height: 20px; " align="center">
                {{ number_format($dt->subtotal,0,',','.') }}
            </td>
            @endforeach
        </tr>
        <tr style="border: 1px solid black" >
            <td colspan="4" style="padding: 10px; border: 1px solid black; width: 200px; " align="center">
                JUMLAH TOTAL
            </td>
            <td style="padding: 10px; width: 50px; border: 1px solid black " align="center">
                {{ number_format($jumlah[0]->totalfix,0,',','.') }}
            </td>
        </tr>
        <tr style="border: 1px solid black;" >
            <td colspan="4" style="padding: 10px; border: 1px solid black " align="center">
                JUMLAH TOTAL (PEMBULATAN)
            </td>
            <td style="padding: 10px; width: 50px; border: 1px solid black " align="center">
            {{ number_format($jumlah[0]->totalpembulatan,0,',','.') }}
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
    @include('template.footerspj')
</section>

</div>
<script>
    window.print()
</script>
</body>
</html>