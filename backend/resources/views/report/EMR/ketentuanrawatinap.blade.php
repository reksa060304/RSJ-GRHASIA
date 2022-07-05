<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Ketentuan Rawat Inap</title>
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

<body class="A4" style="font-family:Arial;height: auto" >
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
                <td colspan="3" style="text-align: center;font-family: Arial; font-size: 12pt "><b>KETENTUAN RAWAT INAP</b></td>
            </tr>
            <tr>
                <td>
                    <table border="0" align="center" width="100%"
                        style="line-height: 15px;text-align: justify">
                        <tr>
                            <td colspan="2"><b>KETENTUAN UMUM</b></td>
                        </tr>
                        <tr>
                            <td valign="top">1. </td>
                            <td>Dilarang mendokumentaskikan / memotret / merekam proses tindakan medis / keperawatan dengan cara apapun dan dengan alasan apapun, 
                                tanpa IZIN tertulis dari Rumah Sakit Jiwa Grhasia.</td>
                        </tr>
                        <tr>
                            <td valign="top">2. </td>
                            <td>Dilarang merokok di lingkungan Rumah Sakit Jiwa Grhasia, 
                                berdasarkan Peraturan Gubernur DIY Nomor 42 Tahun 2009 tentang Kawasan Dilarang Merokok.</td>
                        </tr>
                        <tr>
                            <td valign="top">3. </td>
                            <td>Setiap pasien mempunyai hak dan kewajiban sesuai standar pelayanan di Rumah Sakit Grhasia.</td>
                        </tr>
                        <tr>
                            <td valign="top">4. </td>
                            <td>Peraturan tata tertib Rumah Sakit Jiwa Grhasia wajib dipatuhi, kebersihan, kenyamanan dan ketenangan Rumah Sakit Jiwa Grhasia wajib dijaga.</td>
                        </tr>
                        <tr>
                            <td valign="top">5. </td>
                            <td>Tidak diperkenankan membawa senjata, mengkonsumsi minuman keras, memakai narkotika, 
                                membawa barang-barang elektronik dan hal lain yang berhubungan dengan etika dan moral.</td>
                        </tr>
                        <tr>
                            <td valign="top">6. </td>
                            <td>Rumah Sakit Jiwa Grhasia tidak bertanggungjawab atas kehilangan barang-barang bawaan pasien.</td>
                        </tr>
                        <tr style="text-align: justify">
                            <td colspan="2"><b>PERAWATAN</b></td>
                        </tr>
                        <tr>
                            <td valign="top">1. </td>
                            <td>Pasien menempati ruangan sesuai dengan kelas perawatan yang telah disepakati sebelumnya.</td>
                        </tr>
                        <tr>
                            <td valign="top">2. </td>
                            <td>Staf medis dan para medis Rumah Sakit Jiwa Grhasia berwenang untuk 
                                melakukan tindakan pertolongan medis pada keadaan kegawatan untuk menolong jiwa pasien.</td>
                        </tr>
                        <tr>
                            <td valign="top">3. </td>
                            <td>Petunjuk Dokter dan Perawat wajib dipatuhi. 
                                Tidak dibenarkan membawa obat sendiri dari luar Rumah Sakit Jiwa Grhasia, kecuali atas seizin dan sepengetahuan Dokter.</td>
                        </tr>
                        <tr>
                            <td valign="top">4. </td>
                            <td>Jam berkunjung : <br> Siang : 10.00 - 12.00 WIB <br> Sore : 15.00 - 17.00 WIB</td>
                        </tr>
                        <tr>
                            <td valign="top">5. </td>
                            <td>Penanggung jawab pasien WAJIB datang ke Rumah Sakit Jiwa Grhasia apabila kondisi pasien yang dirawat perlu dirujuk ke Rumah Sakit lain, 
                                untuk penanganan lebih lanjut dan bersedia mendamoingi sampai ke Rumah Sakit Rujukan.</td>
                        </tr>
                        <tr>
                            <td valign="top">6. </td>
                            <td>Penanggung jawab pasien WAJIB mengunjungi pasien secara berkala, 
                                minimal 1 (satu) kali dalam seminggu untuk membantu proses pengobatan pasien melalui peralatan dan dukungan dari keluarga.</td>
                        </tr>
                        <tr>
                            <td colspan="2"><b>PEMBIAYAAN</b></td>
                        </tr>
                        <tr>
                            <td valign="top">1. </td>
                            <td>Pasien dengan Jaminan Kesehatan, 
                                berlaku ketentuan yang telah disepakati dalam perjanjian kerja sama antara Rumah Sakit Jiwa Grhasia dan badan penjamin terkait.</td>
                        </tr>
                        <tr>
                            <td valign="top">2. </td>
                            <td>Rumah Sakit Jiwa Grhasia tidak bertanggung jawab atas segala resiko yang timbul akibat penyalahgunaan kartu jaminan kesehatan.</td>
                        </tr>
                        <tr>
                            <td valign="top">3. </td>
                            <td>Cara pembayaran selama perawatan : </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td><input type="checkbox"{{$detail[0] == 1 ? "checked": ""}}> a. Umum</td>
                                        <td><input type="checkbox" {{$detail[0] == 1 ? "checked": ""}}> c. JKN I / II / III PBI / Mandiri</td>
                                        <td> <input type="checkbox">e. IPWL</td>
                                    </tr>
                                    <tr>
                                        <td> <input type="checkbox" {{$detail[0] == 1 ? "checked": ""}}>b. Jamkesos</td>
                                        <td> <input type="checkbox" {{$detail[0] == 1 ? "checked": ""}}>d. Jamkesda</td>
                                        <td> <input type="checkbox">f. Proses</td>
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
                        <tr style="text-align: center">
                            <td style="width: 150px">Yang menyerahkan<br>Petugas RSJ Grhasia</td>
                            <td style="width: 100px"></td>
                            <td style="width: 150px">Yang Menerima</td>
                        </tr>
                        <tr style="text-align: center">
                            <td style="padding-top: 100px">{{substr($detail[1]['value'],strpos($detail[1]['value'], "~")+1)}}</td>
                            <td></td>
                            <td style="padding-top: 100px">{{$detail[1]['value']}}</td>
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
