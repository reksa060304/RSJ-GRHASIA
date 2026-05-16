<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Surat KGB : {{$data[0]->namalengkap}}</title>
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

        /* .table {
            width: 100%;
            height: 100%; 
        } */

        #dt td {
            font-family: Arial;
            font-size: 11pt;
        }
    </style>
</head>

<body class="A4" style="font-family:Arial;height: auto">
    <section class="sheet padding-15mm" style="font-family:Arial">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td style="padding-bottom:1em; width: 15%;">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                                <img src="{{ asset('img/diy.png') }}" alt="Logo" style="width: 100%;">
                            @else
                                <img src="{{ asset('service/img/diy.png') }}" alt="Logo" style="width: 100%;">
                            @endif
                        </td>
                        <td style="text-align: center; font-family: Arial">
                        <span style="font-size: 12pt">{{strtoupper($profile[0]->baris1)}}</span><br>
                        <span style="font-size: 12pt;">{{strtoupper($profile[0]->baris2)}}</span><br>
                        <span style="font-size: 14pt;">{{strtoupper($profile[0]->namalengkap)}}</span><br>
                        <img src="data:image/jpeg;base64,{{$profile[0]->gambarlogo}}" alt="" style="width: 200px;"><br>
                        <span color="#000000" style="font-size: 10pt">
                            Jalan Kaliurang Km 17 Yogyakarta
                            Telepon {{$profile[0]->fixedphone}} <br>
                            Faksimile: {{$profile[0]->faksimile}}
                            Laman: {{ $profile[0]->website}}, <br>
                            Surel:
                            {{-- {{ $profile[0]['website']}} --}}
                            {{$profile[0]->alamatemail}}
                            Kode Pos {{$profile[0]->kodepos}}
                        </span>
                    </td>
                        <td style="padding-bottom:1em; width: 20%;">
                            @if (stripos(\Request::url(), 'localhost')!== FALSE)
                                <img src="{{ asset('img/logo_grhasiafull.png') }}" alt="Logo" style="width: 100%;">
                            @else
                                <img src="{{ asset('service/img/logo_grhasiafull.png') }}" alt="Logo" style="width: 100%;">
                            @endif
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr style="border:1px solid #000;margin-bottom:0px">
            <hr style="border:0.5px solid #000;margin-top:2px">
 
            <tr>
                <td>
                    <table style="text-align:center;font-family: Arial; padding-left: 79%">           
                <tr>
                            <td style="font-size: 11pt">${tanggal_naskah}</td>
                </tr>
                    </table>
                </td>
            </tr>
            <table id="dt" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="padding-left: 5%; font-family: Arial; font-size: 11pt">
                        Yth. Kepala Badan Pengelola Keuangan dan Aset <br>
                    </td>
                </tr>
                <tr>
                    <td style="padding-left: 9.5%; font-family: Arial; font-size: 11pt">
                        c.q. Kepala Bidang Pengelolaan Kas Daerah DIY <br>
                        <br>
                        di Yogyakarta <br>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; padding-top: 20px; padding-bottom: 15px; font-family: Arial; font-size: 12pt">
                        <b><u>SURAT PEMBERITAHUAN KENAIKAN GAJI BERKALA</u></b>
                        <div style="margin-top: 10px;">
                            NOMOR : ${nomor_naskah}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td height="50" style="padding-left: 5%;font-family: Arial; font-size: 11pt">
                        Dengan ini diberitahukan bahwa berhubung telah dipenuhi masa kerja dan syarat-syarat lainnya maka kepada:
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 11pt">
                        <table style="font-family: Arial; padding-left: 15%;line-height: 12px">
                            <tr>
                                <td style="font-size: 11pt">1. </td>
                                <td style="font-size: 11pt">N a m a</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt">{{$data[0]->namalengkap}}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt">2. </td>
                                <td style="font-size: 11pt">NIP</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt">{{$data[0]->nippns}}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt">3. </td>
                                <td style="font-size: 11pt">Pangkat/Golongan</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt">{{$data[0]->panggol}}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt">4. </td>
                                <td style="font-size: 11pt">Instansi</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt">Rumah Sakit Jiwa Grhasia Dinkes DIY</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt">5. </td>
                                <td style="font-size: 11pt">Gaji Pokok Lama</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt">{{$data[0]->gajiawal}}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt"></td>
                                <td style="font-size: 11pt">Berdasarkan</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt">
                                    {{-- {{var_dump($data[0]->jenissk)}} --}}

                                    @if ($data[0]->jenisskco == 'KGB')

                                    Surat Pemberitahuan Kenaikan Gaji Berkala
                                    @elseif($data[0]->jenisskco == 'KP')
                                    Surat Keputusan Kenaikan Pangkat
                                    @endif

                                    {{-- {{ $data[0]->jenissk == 'KGB' ? 'Kenaikan Gaji Berkala' : $data[0]->jenissk == 'KP' ? 'SK Kenaikan Pangkat': ''}} --}}

                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt"></td>
                                <td style="font-size: 11pt; padding-left: 20px;">Nomor</td>
                                <td style="font-size: 11pt">:</td>
                                <td style="font-size: 11pt"> {{$data[0]->sklama }}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt"></td>
                                <td style="font-size: 11pt; padding-left: 20px;">Tanggal</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt"> {{$data[0]->tglsklama }}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt"></td>
                                <td style="font-size: 11pt; padding-left: 20px;">Terhitung Mulai Tanggal</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt"> {{$data[0]->tmtlama }} </td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt" colspan="4" height="30" style="padding-left: 6%">Diberikan Kenaikan Gaji Berkala sehingga memperoleh :</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt">1. </td>
                                <td style="font-size: 11pt">Gaji Pokok Baru</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt">{{$data[0]->gajiakhir}}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 11pt">2. </td>
                                <td style="font-size: 11pt">Berdasarkan Masa Kerja</td>
                                <td style="font-size: 11pt"> : </td>
                                <td style="font-size: 11pt">{{explode(" ",$data[0]->masakerjagolongan)[0]}} Th {{sprintf("%02d", explode(" ",$data[0]->masakerjagolongan)[2])}} Bln</td>
                                {{-- <td style="font-size: 11pt">{{$data[0]->thn}} Thn {{$data[0]->bln}} Bln
                    </td> --}}
                </tr>
                <tr>
                    <td style="font-size: 11pt">3. </td>
                    <td style="font-size: 11pt">Dalam Golongan Ruang</td>
                    <td style="font-size: 11pt"> : </td>
                    <td style="font-size: 11pt">{{$data[0]->golongan}}</td>
                </tr>
                <tr>
                    <td style="font-size: 11pt">4. </td>
                    <td style="font-size: 11pt">Terhitung Mulai Tanggal</td>
                    <td style="font-size: 11pt"> : </td>
                    <td style="font-size: 11pt">{{$data[0]->tmtbaru}}</td>
                </tr>

            </table>
            </td>
            </tr>
            <tr>
                <td height="50" style="padding-left: 5%;font-size: 11pt" colspan="4">
                    Diharap agar sesuai dengan Peraturan Pemerintah {{$data[0]->namask}}. Pegawai tersebut
                    dapat dibayarkan penghasilannya berdasarkan gaji pokok yang baru.
                </td>
            </tr>
            <tr>
                <td>
                    <table style="text-align:left;font-family: Arial; padding-left: 63%">
                        
                        <tr>
                            <td style="padding-bottom: 52px;font-size: 11pt">DIREKTUR,</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt; padding-bottom: 50px">${ttd_pengirim}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt"><b>dr. AKHMAD AKHADI S., M.P.H. <br>
                                </b></td>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table style="font-family: Arial;line-height: 12px">
                        <tr>
                            <td colspan="2" style="font-size: 11pt">Tembusan :</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px; font-size: 11pt">1. </td>
                            <td style="font-size: 11pt">Kepala Dinas Kesehatan DIY;</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px; font-size: 11pt">2. </td>
                            <td style="font-size: 11pt">Kepala Badan Kepegawaian Daerah DIY;</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px; font-size: 11pt">3. </td>
                            <td style="font-size: 11pt">Inspektur DIY;</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px; font-size: 11pt">4. </td>
                            <td style="font-size: 11pt">Kepala PT.TASPEN (Persero) Kantor Cabang Yogyakarta.</td>
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
<script>
    window.onload = function() {
        window.print();
    };
    window.onafterprint = function() {
        window.close();
    };
</script>
</body>

</html>