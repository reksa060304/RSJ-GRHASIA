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
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}">
        <tbody>
        <tr>
            <td colspan="2" style="padding: 30px; text-align:left">
                <b>
                    <font style="font-size: 12pt" color="#000000">Lembar : I/II/III/IV/V</font>
                </b> 
            </td>
            <td style="padding: 30px" align="right">
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
                <font style="font-size: 12pt" color="#000000">: (Ini dinamis)</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 75px;">
                <font style="font-size: 12pt" color="#000000">Yaitu untuk membayar: </font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 10px;">
                <font style="font-size: 12pt" color="#000000">{{$keterangan[0]->keteranganbelanja}} pada sub kegiatan {{ $kegiatan[0]->ktsub }} sub sub kegiatan {{ $kegiatan[0]->ktsubsub }} dengan rincian biaya terlampir.</font>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:left; padding-left: 50px; padding-bottom: 5px; padding-top: 40px;">
                <font style="font-size: 12pt" color="#000000">Terbilang: (ini dinamis)</font>
            </td>
        </tr>
        <tr>
            <td colspan="4" style="text-align:right; padding-right: 50px; padding-bottom: 5px; padding-top: 40px;">
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
            <td style="text-align:center; padding-left: 50px; padding-bottom: 100px; padding-top: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">Direktur Selaku KPA</font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 100px; padding-top: 5px; width: 100px;">
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
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: 5px; width: 100px;">
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
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">{{ $spj[0]->nipbendahara}}</font>
            </td>
            <td style="padding: 10px; padding-bottom: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000"></font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 0px; width: 120px; border-top: 4px solid black; ">
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 0px; width: 100px; border-top: 4px solid black">
            </td>
            <td style="padding: 10px; padding-bottom: 0px; width: 100px; border-top: 4px solid black"" align="center">
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: -5px; width: 120px; border-top: 2px solid black; ">
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 5px; padding-top: -5px; width: 100px; border-top: 2px solid black">
            </td>
            <td style="padding: 10px; padding-bottom: 5px; padding-top: -5px; width: 100px; border-top: 2px solid black"" align="center">
            </td>
        </tr>
        <tr>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 100px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">
                    Barang tersebut telah diterima dengan cukup dan baik
                </font>
            </td>
            <td style="text-align:center; padding-left: 50px; padding-bottom: 100px; width: 100px;">
                <font style="font-size: 12pt" color="#000000">
                    Telah dipungut: <br>
                    <div class="container">
                        <div class="row">
                            <div class="grid_6" >
                                <p style="width: 50%">PPn:</p><p style="width: 50%">{{ $spj[0]->ppn }}</p>
                            </div>
                            <div class="grid_6" style="width: 50%">
                                
                            </div>
                        </div>
                        
                    </div>
                    <p style="teaxt-align: left; width: 50%">PPn </p><p style="text-align: right; width: 50%">: {{ $spj[0]->ppn }}</p>
                    <p style="border-bottom: 1px solid black;">PPh: {{ $spj[0]->pph }}</p>
                    <p>{{ $spj[0]->totalpp }}</p>
                </font>
            </td>
            <td style="padding: 10px; padding-bottom: 100px; padding-top: 5px; width: 100px;" align="center">
                <font style="font-size: 12pt" color="#000000">Tanda Tangan</font>
            </td>
        </tr>
        </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
</div>
</body>
</html>