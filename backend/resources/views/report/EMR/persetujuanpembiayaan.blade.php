<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Ketentuan Rawat Inap</title>
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

        /* @media print { */
        /*    body {margin:0}*/
        /* section {page-break-after: always;} */

        /* } */
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
        td {
            padding: 0; 
            margin: 0;
            font-family: Arial;
        }
    </style>
</head>

<body class="A4" style="font-family:Arial;" onLoad="window.print()">
    <section class="sheet padding-10mm" style="font-family:Arial">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/WhatsApp Image 2022-06-10 at 10.59.25.jpeg') }}" alt=""
                            style="width: 85px;">
                            
                        @else
                        <img src="{{ asset('service/img/WhatsApp Image 2022-06-10 at 10.59.25.jpeg') }}" alt=""
                            style="width: 85px;">
                        @endif
                        {{-- <span style="font-size: 9pt;font-weight: bold; ;font-family: Arial">RSJ GRHASIA</span> --}}
                    </td>
                    <td style="text-align: center;font-family: Arial">
                        <span style="font-size: 10pt;">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</span></br>
                        <span style="font-size: 12pt;">DINAS KESEHATAN</span><br>
                        <span style="font-size: 11pt;">RUMAH SAKIT JIWA GRHASIA</span><br>
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/Aksara Jawa_Surat.png') }}" alt="" style="width: 150px;">
                        @else
                        <img src="{{ asset('service/img/Aksara Jawa_Surat.png') }}" alt="" style="width: 150px;">
                        @endif <br>
                        <span color="#000000" style="font-size: 7pt;">
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
        <hr style="border:1px solid #000;margin: 0;">
        {{-- <hr style="border:0.5px solid #000;margin-top:2px"> --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td colspan="3" style="text-align: center;font-family: Arial; font-size: 12pt " height="50"><b>SURAT PERMOHONAN DAN PERSETUJUAN PEMBIAYAAN PERAWATAN</b></td>
            </tr>
            <tr>
                <td>
                    <table border="0" align="center" width="100%"
                        style="line-height: 20px;text-align: justify;">
                        <tr>
                            <td colspan="3">Yang bertanda tangan dibawah ini</td>
                        </tr>
                        <tr>
                            <td width="150">Nama (lengkap)</td>
                            <td>: {{$detail[0]['value']}}</td>
                            <td>NO.KTP {{$detail[1]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td colspan="2">: {{$detail[2]['value']}}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="2">Nomor Telepon : {{$detail[3]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Pekerjaan / Jabatan</td>
                            <td colspan="2">: {{$detail[4]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Hubungan</td>
                            <td colspan="2">: {{$detail[5]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Dengan ini mengajukan permohonan agar,</td>
                        </tr>
                        <tr>
                            <td>Nama (lengkap)</td>
                            <td colspan="2">: {{$detail[6]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Status Penderita</td>
                            <td colspan="2">: {{$detail[7]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Jenis Kelamin</td>
                            <td colspan="2">: {{$detail[8]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Nomor RM</td>
                            <td colspan="2">: {{$detail[9]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Tempat, Tgl Lahir/Umur</td>
                            <td>: {{$detail[10]['value']}}</td>
                            <td>/ {{$detail[11]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td colspan="2">: {{$detail[12]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="padding-top: 50px">Diterima untuk mendapat perawatan di RSJ Grhasia di {{$detail[13]['value']}} Kelas {{$detail[14]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Dengan cara pembayaran : </td>
                            <td>@if ($detail[15]['value'] == 1)<s>1. Umum</s>@else 1. Umum @endif </td>
                            <td>@if ($detail[17]['value'] == 1)<s>4. JKN I / II / III Mandiri </s>@else 4. JKN I / II / III Mandiri @endif </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>@if ($detail[16]['value'] == 1)<s>2. JAMKESOS</s>@else 2. JAMKESOS @endif </td>
                            <td>@if ($detail[18]['value'] == 1)<s>5. JAMKESDA Bantul / Kulon Progo / Kodya </s>@else 5. JAMKESDA Bantul / Kulon Progo / Kodya @endif </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>@if ($detail[19]['value'] == 1)<s>3. IPWL</s>@else 3. IPWL @endif </td>
                            <td>6. Proses {{$detail[20]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Mulai Tanggal {{$detail[21]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Saya bersedia mentaati segala persyaratan dan tata tertib yang ada di RSJ grhasia. 
                                Apabila tidak, saya sanggup menanggung segala risiko yang diakibatkan karenanya.</td>
                        </tr>
                        <tr>
                            <td colspan="3" height="100">
                                <table style="margin-left: 70%">
                                    <tr>
                                        <td style="padding-top: 70px"  align="center" >Yogyakarta, {{$detail[22]['value']}}</td>
                                    </tr>
                                    <tr>
                                        <td  align="center">Pemohon, </td>
                                    </tr>
                                    <tr>
                                        <td  align="center" height="100">{{$detail[23]['value']}}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                </td>
            </tr>
            {{-- <tr>
                <td>
                    <table align="center" border="0" align="center" width="100%"
                        style="line-height: 15px;">
                        <tr>
                            <td></td>
                            <td colspan="2" align="center">Yogyakarta, {{$detail[7]['value']}}</td>
                        </tr>
                        <tr style="text-align: center">
                            <td style="width: 150px">Petugas Rawat Inap</td>
                            <td style="width: 100px"></td>
                            <td style="width: 150px">Pasien / Penanggung Jawab</td>
                        </tr>
                        <tr style="text-align: center">
                            <td style="padding-top: 50px">{{substr($detail[6]['value'],strpos($detail[6]['value'], "~")+1)}}</td>
                            <td></td>
                            <td style="padding-top: 50px">{{$detail[8]['value']}}</td>
                        </tr>
                    </table>
                </td>
            </tr> --}}
            
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
