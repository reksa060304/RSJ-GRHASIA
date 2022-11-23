<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report Cetak Kwitansi</title>
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
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
    @endif
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
            font-family: Tahoma;
            font-size: 10pt;
        }
        body{
            font-family: Tahoma;
        }
    </style>
</head>

<body class="A4" style="font-family:Arial;height: auto">
    <section class="sheet padding-15mm" style="font-family:Arial">

        <table cellspacing="0" cellpadding="0" border="0" width="100%" >
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/logo_grhasia.png') }}" alt=""
                            style="width: 90px;">
                        @else
                        <img src="{{ asset('service/img/logo_grhasia.png') }}" alt=""
                            style="width: 90px;">
                        @endif

                    </td>
                    <td style="text-align: left; font-family: Arial">

                        <span style="font-size: 14pt;"><b>Rumah Sakit Jiwa Grhasia</b></span><br>
                        
                        <span color="#000000" style="font-size: 10pt">
                            Jl. Kaliurang KM 17 Yogyakarta
                            Telepon (0274) 895143, 895297
                            Facsimile (0274) 895142
                            <br>Website :
                            grhasia.jogjaprov.go.id Email :
                            grhasiamentalhospital@jogjaprov.go.id <br>
                            Kode Pos 55582
                        </span>
                    </td>
                    
                    
                </tr>
                <tr>
                    <th colspan="2">PERINCIAN BIAYA PELAYANAN</th>
                </tr>
            </tbody>
        </table>

        <hr style="border:1px solid #000;margin-bottom:0px">
        @foreach ($data as $d)
        <table id="dt" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td>
                        <table>
                            <tr>
                                <td>No. Kwitansi</td>
                                <td> : </td>
                                <td>{{$d->nosbm}}</td>
                            </tr>
                            <tr>
                                <td>Nama Institusi</td>
                                <td> : </td>
                                <td>{{$d->namapasien}}</td>
                            </tr>
                            <tr>
                                <td>Tanggal Kegiatan</td>
                                <td> : </td>
                                <td>{{\Carbon\Carbon::parse($d->tanggalmulai)->format('Y-m-d')}} S/D {{\Carbon\Carbon::parse($d->tanggalselesai)->format('Y-m-d')}}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
        </table>
        {{-- <hr style="border:1px solid #000;margin-bottom:0px"> --}}
        <table  width="100%" style="border-bottom: 1pt solid black;border-top: 1pt solid black;">
            <tr>
                <th>Tanggal</th>
                <th>Kegiatan</th>
                <th>Qty</th>
                <th>Tarif</th>
                <th>Total</th>
            </tr>
            <tr style="text-align: center;">
                <td>{{$d->tglregistrasi}}</td>
                <td>{{$d->namaproduk}}</td>
                <td>{{$d->jumlah}}</td>
                <td>Rp. {{number_format($d->hargasatuan,2)}}</td>
                <td>Rp. {{number_format($d->total, 2)}}</td>
            </tr>
            
        </table>
        <table width="100%" >
            <tr style="text-align: right;">
                <td>Total Transaksi</td>
                <td width="100px">Rp. {{number_format($d->total, 2)}}</td>
            </tr>
        </table>
        <table style="text-align: center">
            <tr>
                <td style="height: 20px">Sleman, {{\Carbon\Carbon::now()->format('Y-m-d')}}</td>
            </tr>
            <tr>
                <td style="height: 80px"></td>
            </tr>
            <tr>
                <td>{{$d->namalengkap}}</td>
            </tr>
        </table>
        @endforeach
        
    </section>
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
