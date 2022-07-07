<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report Perjanjian Pasien Melarikan Diri</title>
    

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
        section {
            page-break-after: always;
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

<body class="A4" style="font-family:Arial;height: auto" onLoad="window.print()">
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
                <td height="100" colspan="2" style="text-align: center;font-family: Arial; font-size: 12pt "><b>PERJANJIAN PASIEN MELARIKAN DIRI</b></td>
            </tr>
            <tr>
                <td>
                    <table border="0" align="center" width="100%"
                        style="line-height: 25px;text-align: justify;font-family: Arial;">
                        <tr>
                            <td colspan="2" style="">Yang bertanda tangan dibawah ini, Saya : </td>
                        </tr>
                        <tr>
                            <td width="100">Nama</td>
                            <td style="text-align: justify;font-family: Arial"> : {{$detail[0]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td style="text-align: justify;font-family: Arial"> : {{$detail[1]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Nomor Identitas</td>
                            <td style="text-align: justify;font-family: Arial"> : {{$detail[2]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Nomor Telepon</td>
                            <td style="text-align: justify;font-family: Arial"> : {{$detail[3]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="2">Sebagai penanggungjawab pasien tersebut di atas, dengan ini menyatakan dengan sesungguhnya bahwa :</td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td valign="top">1. </td>
                                        <td>Saya menyadari adanya kemungkinan pasien melakukan tindakan-tindakan yang di luar kendali atau kesadarannya. Tindakan-tindakan tersebut, 
                                            diantaranya dapat berupa resiko melarikan diri, kecelakaan maupun keselamatan jiwanya, baik di dalam maupun di luar wilayah kerja Rumah Sakit Jiwa Grhasia DIY, 
                                            bukanlah menjadi tanggung jawab Rumah Sakit Jiwa Grhasia DIY sepanjang tidak ditemukan unsur kelalaian dari pihak Rumah Sakit Jiwa Grhasia DIY.</td>
                                    </tr>
                                    <tr>
                                        <td valign="top">2. </td>
                                        <td>Dalam hal pasien melarikan diri, maka pihak RSJ Grhasia DIY akan melakukan upaya pencarian pasien melarikan diri tersebut, 
                                            melaporkan kejadian perkara tersebut kepada aparat Kepolisian setempat dan kepada pihak keluarga / penanggungjawab pasien pada kesempatan pertama.</td>
                                    </tr>
                                    <tr>
                                        <td valign="top">3. </td>
                                        <td>Apabila tidak didapatkan unsur kelalaian dari petugas RSJ Grhasia DIY dan dalam waktu 3 x 24 jam terhitung sejak pasien melarikan diri, 
                                            pasien tersebut tidak ditemukan, maka tanggungjawab selanjutnya diserahkan pada pihak keluarga / penanggungjawab.</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table align="center" border="0" align="center" width="100%"
                        style="line-height: 15px;">
                        <tr>
                            <td></td>
                            <td colspan="2" align="center" height="100">Yogyakarta, {{$detail[4]['value']}}</td>
                        </tr>
                        <tr style="text-align: center; margin-top: 50px">
                            <td style="width: 150px">Penanggung Jawab Pasien</td>
                            <td style="width: 100px">Petugas Pemberi Informasi</td>
                            <td style="width: 150px">Saksi</td>
                        </tr>
                        <tr style="text-align: center; ">
                            <td style="padding-top: 100px">{{$detail[5]['value']}}</td>
                            {{-- <td style="padding-top: 100px">{{substr($detail[5]['value'],strpos($detail[5]['value'], "~")+1)}}</td> --}}
                            <td style="padding-top: 100px">{{substr($detail[6]['value'],strpos($detail[6]['value'], "~")+1)}}</td>
                            <td style="padding-top: 100px">{{$detail[7]['value']}}</td>
                        </tr>
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
