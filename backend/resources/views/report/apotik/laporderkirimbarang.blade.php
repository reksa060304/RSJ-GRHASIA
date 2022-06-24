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
            <td style="padding: 30px">
                <div align="center">
                    <p align="right">
                        <!--                        <a href="#"><font face="Arial"><img src="image/report_print.png" onclick="window.print()" height="40" border="0" width="39"></font></a>-->
                        <!--                        <a href="#"><font face="Arial"><img src="image/report_pdf.png" height="40" border="0" width="39"></font></a>-->
                        <!--                        <a href="#"><font face="Arial"><img src="image/report_close.png" onclick="window.close()" height="40" border="0" width="39"></font></a>-->
                        <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" height="133" border="0" width="100%"
                               style="text-align: center">
                            <tbody>
                            <tr>
                                <td style="text-align:left">
                                    <div align="center">
                                        <table cellspacing="0" cellpadding="0" height="74" border="0" width="850">
                                            <tbody>
                                            <tr>
                                                <td valign="top"></td>
                                            </tr>
                                            <tr>
                                                <td valign="top">
                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td width="105">
                    <p align="left">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/logo_grhasia.png') }}" style="width: 80px" border="0">
                            @else
                              <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 80px" border="0">
                            @endif
                      
                    </p>
            </td>
            @php
             $d = App\Http\Controllers\Report\ReportController::getProfile();
             @endphp
            <td align="left">
                <b>
                    <font style="font-size: 18pt" color="#000000">{!! $d['namaprofile'] !!}</font>
                    <br>
                </b>
{{--                <b>--}}
{{--                    <font style="font-size: 18pt" color="#000000">{!! $d['alamat'] !!}</font>--}}
{{--                    <br>--}}
{{--                </b>--}}
                <font size="3" color="#000000" style="font-weight: bold">{!! $d['alamat'] !!}<font>
                    <br>
                <font size="3" color="#000000" style="font-weight: bold">Tlpn. (0274) 895143, Fax. (0274) 895142<font>

                {{--                                          <font style="font-size: 11pt" color="#000000"> : Jl. Ir. Djuanda No. 106 Km. 2--}}
                {{--                                            Rancabango Kota--}}
                {{--                                            Tasikmalaya<br>--}}
                {{--                                            TAHUN AKADEMIK {{ $thn }}</font>--}}
            </td>
        </tr>
        <tr>
            <td width="105">&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
</div>
<div style="margin-top: -10px">
    <hr style="border:1px solid #000;margin-bottom:0px;border-style: solid">
    <hr style="border:0.5px solid #000;margin-top:2px">
</div>
    <section class="content">
        <div class="container-fluid">


    <div align="center">
        {{-- penting gais ini buat urlnya kalo localhost dan server itu beda --}}
        <table border="0" width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td colspan="3">
                        <p align="center" style="margin-right: 30px; margin-top: 50px; margin-bottom:50px">
                            <font style="font-size: 15pt; " color="#000000" face="Arial">
                                <u>
                                    <b>LAPORAN ORDER DAN KIRIM BARANG</b>
                                </u>
                            </font>
                            <br>
                            <font style="font-size: 13pt; vertical-align: top;" color="#000000" face="Arial">
                                <b>Periode : </b>{{$tglAwal}} </b>s/d {{$tglAkhir}}
                            </font>
                        </p>
                    </td>
                </tr>

            </thead>
        </table>
        <table border="1" width="{{$pageWidth}}" bgcolor="#FFFFFF">
                <tr>
                    <td width="150" style="padding-left: 60px; font-weight: bold ">Nama Obat</td>
                    <td width="50" style="padding-left: 20px; font-weight: bold  ">Qty Order</td>
                    <td width="50" style="padding-left: 20px; font-weight: bold  ">Qty Kirim</td>
                </tr>
                @foreach ($data as $tb)
                <tr>
                    <td width="150" style="padding-left: 60px ">{{$tb->namaproduk}}</td>
                    <td width="50" style="padding-left: 20px ">{{$tb->jumlahorder}}</td>
                    <td width="50" style="padding-left: 20px ">{{$tb->jumlahkirim}}</td>
                </tr>
                @endforeach
        </table>
    </div>
    </div>
    </section>
</div>
</body>
</html>