<!DOCTYPE html>
<html lang="en">
<head>
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
         <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        @else
         <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
        @endif
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
<style type="text/css" media="print">
    @page {
        size: auto;   /* auto is the initial value */
        margin: 0;  /* this affects the margin in the printer settings */
    }
</style>
<style>
    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }
    .space{
        padding-left: 125px;
        padding-bottom: 15px;
        width: 40%
    }
</style>
</head>
<body style="background-color: #CCCCCC">
<div align="center">

    <table border="2" style="display: inline-block;" width="{{$pageWidth}}" class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF"  >
        @foreach ($data as $d)

        <tbody style="display: inline-block; table-layout: fixed">

            <tr >
                <td style="text-align: center;">
                    <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 60px; padding-top: 3px">
                </td>
                <td>
                    <div style="font-size: 10px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center; letter-spacing: -1px">RUMAH
                        SAKIT JIWA GRHASIA</div>
                    <div style="font-size: 15px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;letter-spacing: -1px">
                        INSTALASI DIKLATLITBANG</div>
                </td>
            </tr>
            <tr>
                <td>
                    @if ($d->image == null)
                        <img src="{{ asset('/img/avatar.jpg') }}" alt="" width="75" height="100"
                        style="padding: 5px 20px 5px 20px; text-align: center">
                    @else
                        <img src="/DIKLAT/FileFoto/{{$d->email}}/{{$d->image}}" alt="" width="75" height="100"
                        style="padding: 5px 20px 5px 20px; text-align: center">
                    @endif
                </td>
                <td style="width: 250px">
                    <div style="font-size: 12px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;letter-spacing: -1px">
                        {{$d->detailjenisproduk}}</div>
                    <div style="font-size: 10px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                        {{$d->institusipendidikan}}</div>
                    <div style="font-size: 13px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                        {{$d->nama}}</div>
                    <div style="font-size: 12px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                        {{date('d-m-Y', strtotime($d->tanggalmulai))}} S/D {{date('d-m-Y', strtotime($d->tanggalselesai))}}</div>
                </td>
            </tr>
        </tbody>
     @endforeach


    </table>
</div>


</body>
</html>



