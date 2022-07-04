<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report HPP Minat Bakat</title>
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.qr-code.js') }}"></script>

    @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <!-- angular -->
    <script src="{{ asset('js/angular/angular.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('js/angular/angular-route.min.js') }}" type="text/javascript"></script>
    <script type="text/javascript" src="{{ asset('js/angular/angular-animate.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/angular/angular-aria.min.js') }}"></script>
    <script src="{{ asset('js/angular/angular-material.js') }}" type="text/javascript"></script>
    @else

    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
    <!-- angular -->
    <script src="{{ asset('service/js/angular/angular.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('service/js/angular/angular-route.min.js') }}" type="text/javascript"></script>
    <script type="text/javascript" src="{{ asset('service/js/angular/angular-animate.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('service/js/angular/angular-aria.min.js') }}"></script>
    <script src="{{ asset('service/js/angular/angular-material.js') }}" type="text/javascript"></script>
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
    </style>
</head>

<body class="A4" style="font-family:Arial;height: auto">
    <section class="sheet padding-10mm" style="font-family:Arial">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/logo_only.png') }}" alt=""
                            style="width: 85px;">
                            
                        @else
                        <img src="{{ asset('service/img/logo_only.png') }}" alt=""
                            style="width: 85px;">
                        @endif
                        <span style="font-size: 9pt;font-weight: bold; line-height: -1px;font-family: Arial">RSJ GRHASIA</span>
                    </td>
                    <td style="text-align: center;font-family: Arial">
                        <span style="font-size: 11pt; font-weight: bold; line-height: -1px">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</span></br>
                        <span style="font-size: 13pt;font-weight: bold; line-height: -1px">DINAS KESEHATAN</span><br>
                        <span style="font-size: 12pt;font-weight: bold; line-height: -1px">RUMAH SAKIT JIWA GRHASIA</span><br>
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/Aksara Jawa_Surat.png') }}" alt="" style="width: 150px;">
                        @else
                        <img src="{{ asset('service/img/Aksara Jawa_Surat.png') }}" alt="" style="width: 150px;">
                        @endif <br>
                        <span color="#000000" style="font-size: 8pt">
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
            </tbody>
        </table>
        <hr style="border:1px solid #000;margin-bottom:0px">
        {{-- <hr style="border:0.5px solid #000;margin-top:2px"> --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td colspan="3" style="text-align: center;font-family: Arial; font-size: 12pt "><b>Daftar Hadir Kegiatan Pembimbingan Peserta Didik</b></td>
            </tr>
                @foreach ($judul as $j)
                    <tr>
                        <td>
                            Institusi Pendidikan
                        </td>
                        <td>
                            : {{$j->institusipendidikan}}
                        </td>
                    </tr>
                    <tr>
                        <td>Periode</td>
                        <td>: {{$j->tanggalmulai}} S.D {{$j->tanggalselesai}}</td>
                    </tr>
                @endforeach
                <tr>
                    <td colspan="2">
                        <table border="1" align="center" width="100%"
                    style="border: 3px solid black;border-collapse: collapse;line-height: 25px">
                            <tr>
                                <th width="50">Tanggal</th>
                                <th width="50">Ruangan</th>
                                <th width="90">Pembimbing</th>
                                <th width="80">Mahasiswa</th>
                                <th width="100">Kegiatan</th>
                                <th width="40">Paraf Pembimbing</th>
                            </tr>
                            
                        @foreach ($data as $d)
                            <tr>
                                <td valign="top">{{$d->tglhasilkegiatan}}</td>
                                <td valign="top">{{$d->namaruangan}}</td>
                                <td valign="top">{{$d->namalengkap}}</td>
                                        <td valign="top">
                                            @php
                                            $no = 1;
                                        @endphp
                                    @foreach ($d->mahasiswa as $item)
                                            @php
                                            echo $no++ .". ". $item . "<br>";
                                            @endphp
                                    @endforeach
                                        </td>

                                <td valign="top" style="text-align: justify">{{$d->hasilkegiatan}}</td>
                                <td></td>
                            </tr>
                        @endforeach
                        </table>
                    </td>
                </tr>
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
