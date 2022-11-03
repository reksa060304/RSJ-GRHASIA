<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report Cetak UDD</title>
    {{-- @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    <!-- angular -->
    <script src="{{ asset('js/angular/angular.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('js/angular/angular-route.min.js') }}" type="text/javascript"></script>
    <script type="text/javascript" src="{{ asset('js/angular/angular-animate.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/angular/angular-aria.min.js') }}"></script>
    <script src="{{ asset('js/angular/angular-material.js') }}" type="text/javascript"></script>
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.qr-code.js') }}"></script>
    @else

    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('service/css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/tabel.css') }}">
    <!-- angular -->
    <script src="{{ asset('service/js/angular/angular.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('service/js/angular/angular-route.min.js') }}" type="text/javascript"></script>
    <script type="text/javascript" src="{{ asset('service/js/angular/angular-animate.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('service/js/angular/angular-aria.min.js') }}"></script>
    <script src="{{ asset('service/js/angular/angular-material.js') }}" type="text/javascript"></script>
    <script src="{{ asset('service/js/jquery.min.js') }}"></script>
    <script src="{{ asset('service/js/jquery.qr-code.js') }}"></script>
    @endif --}}
    <style>
        @page {
            size: A4;
        }

        /*@media print {*/
        /*    body {margin:0}*/
        /*}*/
        .double-border {

            border: 4px solid #000;

        }

        .double-border:before {

            border: 4px solid #fff;

        }

        .box {
            border: 2px solid black;
            /*border-radius: 6px;*/
        }

        .garis6 td {
            padding: 3px;
        }

        .bold {
            font-weight: bold;
        }

        .f-s-15 {
            font-size: 12px;
        }

        .top-height {
            height: 50px;
            vertical-align: text-top;
            width: 15%;
        }

        .text-top {
            vertical-align: text-top;
        }

        table {
            /* width: 100%;
            height: 100%; */
        }
        #dt td{
            font-family: Arial;
            font-size: 10pt;
        }
        
        @media print {
        #waktu{
            writing-mode:lr-tb;
            /* text-orientation: upright */
        }
    
     


        }
    </style>
</head>

<body style="font-family:Arial;">

    @foreach ($result as $r)
        @foreach ($r as $rr)
        
                <table  cellpadding="0"style="border-collapse: collapse;border: 1px solid black; margin-bottom: 9px;display: inline-block; ">
                <tr>
                    <td height="25px" width="150px" style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 11pt">{{$rr['namapasien']}}</td>
                    <td rowspan="2" width="50px" style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 9pt">TGL <br> {{date('d/m/Y', strtotime($rr['tglpelayanan']))}}</td>
                </tr>
                <tr>
                    <td height="17px" style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: left; font-weight: bold; font-size: 9pt">TL :  {{date('d/m/Y', strtotime($rr['tgllahir']))}}</td>
                </tr>
                <tr>
                    <td valign="top" width="150px" height="117px"> 
                        <table style="font-family:Arial; font-size: 7pt;">
                            @foreach ($rr['detailobat'] as $rpd)
                                <tr >
                                    <td >{{$rpd->namaproduk}}</td>
                                    <td style="text-align: center">{{$rpd->aturan}}</td>
                                    <td >{{$rpd->satuan}}</td>
                                </tr>
                            @endforeach
                        </table>
                    </td>
                    <td id="waktu" height="117px" width="49px" cellpadding="0"style=" border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 9pt">
                        {{$rr['waktu']}}
                    </td>
                </tr>
            </table>
            @endforeach
            
    @endforeach
</body>
<style>
    .footer {
        position: absolute;
        bottom: 5%;
        right: 5%;
    }
</style>
</body>

</html>
