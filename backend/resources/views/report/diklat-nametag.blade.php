<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" 
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    @else
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
    @endif
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        @page {
            size: auto;
            /* auto is the initial value */
            margin: 0;
            /* this affects the margin in the printer settings */
        }
        @media print {
            .pagebreak { } /* page-break-after works, as well */
        }
        .borderss {
            border-bottom: 1px solid black;
        }
        body {
            font-family: Arial;
        }
        .space {
            padding-left: 125px;
            padding-bottom: 15px;
            width: 40%
        }
         .footer {
        text-align: center;
        /* position: absolute; */
        
        /* page-break-after: auto; */
     }
    </style>
</head>

<body style="background-color: #CCCCCC" >
    @php
        $count=0;
    @endphp
    <div align="center">
        
        {{-- penting gais ini buat urlnya kalo localhost dan server itu beda --}}
        <table border="2" style="display: inline-block;text-align:center; " width="{{$pageWidth}}" cellspacing="0"
            cellpadding="0" bgcolor="#FFFFFF">
             <div align="center" width="{{$pageWidth}}" style="align-items:center;background-color: #ffffff;
            margin: auto;
            width: 50%;
            border: 3px solid #73AD21;
            padding: 10px;">
            Halaman: {{$data->appends(['norec' => $norec])->links()}}
            </div>   
            @foreach ($data as $d)
            <tbody border="2" style="display: inline-block; table-layout: fixed; margin: 5px;  border: 2px solid #000000;">
                <tr>
                    <td style="text-align: center;">
                        @if (stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 70px; padding: 3px">
                        @else
                            <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 70px; padding: 3px">
                        @endif
                    </td>
                    <td>
                        <div
                            style="font-size: 10px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center; letter-spacing: -1px">
                            RUMAH
                            SAKIT JIWA GRHASIA</div>
                        <div
                            style="font-size: 15px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;letter-spacing: -1px">
                            INSTALASI DIKLATLITBANG</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        @if ($d->image == null)
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                                <img src="{{ asset("img/avatar.jpg") }}" alt="" width="75" height="100"
                                    style="padding: 5px 20px 5px 20px; text-align: center">
                            @else
                                <img src="{{ asset("service/img/avatar.jpg") }}" alt="" width="75" height="100"
                                    style="padding: 5px 20px 5px 20px; text-align: center">
                            @endif
                        @else
                            @if (stripos(\Request::url(), 'localhost') !== FALSE)
                                <img src="{{ asset("img/DIKLAT/FileFoto/" . $d->email . "/" . $d->image) }}" alt="" style="padding: 5px 20px 5px 20px; text-align: center; width: 4cm; height: 4cm">
                            @else
                                <img src="{{ asset("service/img/DIKLAT/FileFoto/" . $d->email . "/" . $d->image) }}" alt="" style="padding: 5px 20px 5px 20px; text-align: center; width: 4cm; height: 4cm">
                            @endif
                        @endif
                    </td>
                    <td style="width: 250px">
                        <div
                            style="font-size: 12px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;letter-spacing: -1px">
                            {{$d->detailjenisproduk}}</div>
                        <div style="font-size: 10px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                            {{$d->institusipendidikan}}</div>
                        <div style="font-size: 13px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                            {{$d->nama}}</div>
                        <div style="font-size: 12px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                            {{date('d-m-Y', strtotime($d->tanggalmulai))}} S/D
                            {{date('d-m-Y', strtotime($d->tanggalselesai))}}</div>
                    </td>
                </tr>
            </tbody>
            @endforeach
        </table>
    </div>
</body>
</html>