<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report Invoice Diklat</title>
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
            font-family: Arial;
            font-size: 10pt;
            
        }
        #mh td{
            font-family: Arial;
            font-size: 10pt;
            /* height: 30px; */
        }
        th{
            font-family: Arial;
            font-size: 10pt;
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
                            style="width: 90px; margin-right: 30px">
                        @else
                        <img src="{{ asset('service/img/logo_grhasia.png') }}" alt=""
                            style="width: 90px; margin-right: 30px">
                        @endif

                    </td>
                    <td style="text-align: left; font-family: Arial">

                        <span style="font-size: 12pt; "><b>RSJ. GRHASIA INSTALASI DIKLAT</b></span></br>
                        
                        
                        <span color="#000000" style="font-size: 10pt">
                            <b>
                                Jl. Kaliurang KM 17 Yogyakarta <br>
                            Telepon (0274) 895143, 895297
                            Facsimile (0274) 895142
                            Kode Pos 55582
                            </b>
                        </span>
                    </td>
                    
                    
                </tr>
                <tr>
                    
                </tr>
            </tbody>
        </table>

        <hr style="border:1px solid #000;margin-bottom:0px">
        <hr style="border:0.5px solid #000;margin-top:2px">
        <table id="dt" cellspacing="0" cellpadding="0" border="0" width="100%">
            @foreach ($detail as $d)
                <tr>
                    <td>INSTANSI</td>
                    <td> : </td>
                    <td>{{$d->institusipendidikan}}</td>
                </tr>
                <tr>
                    <td>KEGIATAN</td>
                    <td> : </td>
                    <td>{{$d->detailjenisproduk}}</td>
                </tr>
                <tr>
                    <td>UNTUK - LEVEL PENDIDIKAN</td>
                    <td> : </td>
                    <td>{{$d->namaproduk}}</td>
                </tr>
                <tr>
                    <td>TANGGAL</td>
                    <td> : </td>
                    <td>{{$d->tanggalmulai}} S/D {{$d->tanggalselesai}}</td>
                </tr>
                <tr>
                    <td>JUMLAH PESERTA</td>
                    <td> : </td>
                    <td>{{$d->jumlahpeserta}}</td>
                </tr>
                <tr>
                    <td>QUANTITY/WAKTU</td>
                    <td> : </td>
                    <td>{{$d->qty}} {{$d->satuan}}</td>
                </tr>
                <tr>
                    <td>BIAYA</td>
                    <td> : </td>
                    <td>Rp. {{number_format($d->biayapenelitian, 2)}}</td>
                </tr>
                <tr>
                    <td colspan="3" >
                        <table id="mh"cellspacing="0" cellpadding="0" border="1" width="100%" style="margin-top: 20px;" >
                            <tr style="font-weight: bold">
                                <th>NO</th>
                                <th>NAMA MAHASISWA</th>
                                <th>NIM MAHASISWA</th>
                                <th>PEMBIMBING</th>
                                <th>RUANGAN</th>
                            </tr>
                            @php
                                $no=1;
                            @endphp
                            @if (count($mahasiswa) == 0)
                                <td>1</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            @else
                                @foreach ($mahasiswa as $m)
                                    <tr>
                                        <td>{{$no++}}</td>
                                        <td>{{$m->nama}}</td>
                                        <td>{{$m->nim}}</td>
                                        <td>{{$m->namalengkap}}</td>
                                        <td>{{$m->namaruangan}}</td>
                                    </tr>
                                @endforeach
                            @endif
                            
                        </table>
                    </td>
                </tr>
                <tr>
                    <table>
                        <tr>
                            <td colspan="2" style="padding-top: 20px;">
                                Pembayaran bisa dilakukan : 
                            </td>
                        </tr>
                        <tr>
                            <td width="10px">
                                1. 
                            </td>
                            <td>
                                Langsung Ke Kasa RSJ Grhasia
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2. 
                            </td>
                            <td>
                                Kirim Ke Rekening RS Jiwa Grhasia BPD DIY : 041 111 000043 An RS Grhasia Prop DIY QQ BLU dengan format: Nama - Asal Insitusi-Jenis Pembayaran Kegiatan
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                Apabila sudah melakukan pembayaran mohon konfirmasi ke Instalasi Diklatlitbang. 
                            </td>
                        </tr>
                    </table>
                </tr>
                <tr></tr>
            @endforeach
        </table>
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
