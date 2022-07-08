<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Surat Bukti Pengembalian</title>
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
                <td colspan="3" style="text-align: center;font-family: Arial; font-size: 12pt "><b>SURAT BUKTI PENGEMBALIAN / PENERIMAAN KEMBALI <br>
                    PASIEN DARI RSJ GRHASIA</b></td>
            </tr>
            <tr>
                <td>
                    <table border="0" align="center" width="100%"
                        style="line-height: 25px;">
                        <tr>
                            <td colspan="3" style="font-family: Arial">Yang bertanda tangan dibawah ini, Saya : </td>
                        </tr>
                        <tr>
                            <td width="80">Nama</td>
                            <td colspan="2" style="text-align: justify;font-family: Arial"> : {{$detail[0]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Umur</td>
                            <td colspan="2" style="text-align: justify;font-family: Arial"> : {{$detail[1]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Jenis Kelamin</td>
                            <td colspan="2" style="text-align: justify;font-family: Arial"> : @if ($detail[2]['value'] == 1)Laki-Laki @else <s>Laki-Laki</s>@endif / @if ($detail[3]['value'] == 1) Perempuan @else <s>Perempuan</s>@endif</td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td colspan="2" style="text-align: justify;font-family: Arial"> : {{$detail[4]['value']}}</td>
                        </tr>
                        <tr>
                            <td> . </td>
                            <td width="150">Sesuai KTP(kartu identitas)</td>
                            <td style="text-align: justify;font-family: Arial"> : {{$detail[5]['value']}}</td>
                        </tr>
                        <tr>
                            <td> . </td>
                            <td>Tempat tinggal sekarang</td>
                            <td style="text-align: justify;font-family: Arial"> : {{$detail[6]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Hubungan keluarga dengan pasien tersebut di bawah : {{$detail[7]['value']}}</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 50px" colspan="3">Menyatakan bahwa pada hari ini tanggal {{ $detail[8]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Telah menerima kembali seorang pasien</td>
                        </tr>
                        <tr>
                            <td>Nama</td>
                            <td colspan="2"> : {{$detail[9]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Umur</td>
                            <td colspan="2"> : {{$detail[10]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Nomor RM</td>
                            <td colspan="2"> : {{$detail[11]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Jenis Kelamin</td>
                            <td colspan="2"> : {{$detail[12]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td colspan="2"> : {{$detail[13]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Yang dirawat di RSJ Grhasia sejak tanggal {{$detail[14]['value']}} s/d {{$detail[15]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Demikian surat ini saya buat dengan sebenarnya dan saya tanda tangani dihadapan petugas Rumah Sakit Jiwa Grhasia.</td>
                        </tr>
                        <tr >
                            <td colspan="2" width="450" ></td>
                            <td style="padding-top: 100px"> Yogyakarta, {{$detail[16]['value']}}</td>
                        </tr>
                    </table>
                    
                </td>
            </tr>
            <tr>
                <td>
                    <table align="center" border="0" align="center" width="100%"
                        style="line-height: 15px;">
                        <tr style="text-align: center">
                            <td style="width: 150px">Yang menyerahkan<br>Petugas RSJ Grhasia</td>
                            <td style="width: 100px"></td>
                            <td style="width: 150px">Yang Menerima</td>
                        </tr>
                        <tr style="text-align: center">
                            <td style="padding-top: 100px">{{substr($detail[17]['value'],strpos($detail[17]['value'], "~")+1)}}</td>
                            <td></td>
                            <td style="padding-top: 100px">{{$detail[18]['value']}}</td>
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
