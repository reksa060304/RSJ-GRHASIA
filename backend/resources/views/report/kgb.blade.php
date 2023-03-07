<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report Cetak KGB</title>
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
    </style>
</head>

<body class="A4" style="font-family:Arial;height: auto">
    <section class="sheet padding-15mm" style="font-family:Arial">

        <table cellspacing="0" cellpadding="0" border="0" width="100%" >
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        <img src="data:image/jpeg;base64,{{$profile[0]->logopemerintahan}}" alt=""
                            style="width: 90px;">

                    </td>
                    <td style="text-align: center; font-family: Arial">

                        <span style="font-size: 12pt">{{strtoupper($profile[0]->baris1)}}</span><br>
                        <span style="font-size: 16pt;">{{strtoupper($profile[0]->baris2)}}</span><br>
                        <span style="font-size: 14pt;">{{strtoupper($profile[0]->namalengkap)}}</span><br>
                        <img src="data:image/jpeg;base64,{{$profile[0]->gambarlogo}}" alt="" style="width: 170px;"><br>
                        <span color="#000000" style="font-size: 10pt">
                            Jl. Kaliurang KM 17 Yogyakarta
                            Telepon {{$profile[0]->fixedphone}}, 895297
                            Faksimile: {{$profile[0]->faksimile}}
                            <br>Laman: {{ $profile[0]->website}} ,
                            Surel:
                            {{-- {{ $profile[0]['website']}} --}}
                            {{$profile[0]->alamatemail}}<br>
                            Kode Pos {{$profile[0]->kodepos}}
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
            <tr>
                <td style="text-align: center; font-family: Arial; font-size: 12pt">
                    <b><u>SURAT PEMBERITAHUAN KENAIKAN GAJI BERKALA</u></b>
                    <br>
                    NOMOR : {{$data[0]->nosk}}
                    
                </td>
                
            </tr>
            <tr>
                <td style="padding-left: 50%; padding-top: 25px; font-family: Arial">
                    K e p a d a : <br>
                    Yth. Kepala Badan Pengelola Keuangan dan Aset <br>
                    c.q. Kepala Bidang Pengelolaan Kas Daerah DIY <br><br>
                    di -
                    <p style="padding-left: 5%">Yogyakarta <br></p>
                </td>
            </tr>
            <tr>
                <td height="60" style="padding-left: 5%;font-family: Arial; font-size: 11pt">
                    Dengan ini diberitahukan bahwa berhubung telah dipenuhi masa kerja dan syarat-syarat lainnya maka kepada: 
                </td>
            </tr>
            <tr>
                <td >
                    <table style="font-family: Arial; padding-left: 15%;line-height: 12px">
                        <tr>
                            <td >1. </td>
                            <td>N a m a</td>
                            <td> : </td>
                            <td>{{$data[0]->namalengkap}}</td>
                        </tr>
                        <tr>
                            <td>2. </td>
                            <td>NIP</td>
                            <td> : </td>
                            <td>{{$data[0]->nippns}}</td>
                        </tr>
                        <tr>
                            <td>3. </td>
                            <td>Pangkat/Golongan</td>
                            <td> : </td>
                            <td>{{$data[0]->panggol}}</td>
                        </tr>
                        <tr>
                            <td>4. </td>
                            <td>instansi</td>
                            <td> : </td>
                            <td>Rumah Sakit Jiwa Grhasia Dinkes DIY</td>
                        </tr>
                        <tr>
                            <td>5. </td>
                            <td>Gaji Pokok Lama</td>
                            <td> : </td>
                            <td>{{$data[0]->gajiawal}}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Berdasarkan</td>
                            <td> : </td>
                            <td>Surat Pemberitahuan Kenaikan Gaji Berkala</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td> </td>
                            <td>Nomor : {{$data[0]->sklama }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td> </td>
                            <td>Tanggal : {{$data[0]->tglsklama }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td> </td>
                            <td>Terhitung Mulai Tanggal : {{$data[0]->tmtlama }}</td>
                        </tr>
                        <tr>
                            <td colspan="4" height="30" style="padding-left: 6%">Diberikan Kenaikan Gaji Berkala sehingga memperoleh :</td>
                        </tr>
                        <tr>
                            <td>1. </td>
                            <td>Gaji Pokok Baru</td>
                            <td> : </td>
                            <td>{{$data[0]->gajiakhir}}</td>
                        </tr>
                        <tr>
                            <td>2. </td>
                            <td>Berdasarkan Masa Kerja</td>
                            <td> : </td>
                            <td>{{explode(" ",$data[0]->masakerjagolongan)[0]}} Th {{sprintf("%02d", explode(" ",$data[0]->masakerjagolongan)[2])}} Bln</td>
                            {{-- <td>{{$data[0]->thn}} Thn {{$data[0]->bln}} Bln</td> --}}
                        </tr>
                        <tr>
                            <td>3. </td>
                            <td>Dalam Golongan Ruang</td>
                            <td> : </td>
                            <td>{{$data[0]->golongan}}</td>
                        </tr>
                        <tr>
                            <td>4. </td>
                            <td>Terhitung Mulai Tanggal</td>
                            <td> : </td>
                            <td>{{$data[0]->tmtbaru}}</td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
            <tr>
                <td height="70" style="padding-left: 5%;" colspan="4">
                    Diharap agar sesuai dengan Peraturan Pemerintah Nomor : 15 Tahun 2019. Pegawai tersebut
                    dapat dibayarkan penghasilannya berdasarkan gaji pokok yang baru.
                </td>
            </tr>
            <tr>
                <td>
                    <table style="text-align:center;font-family: Arial; padding-left: 60%">
                        <tr>
                            <td>Yogyakarta, {{$data[0]->tglttd}}</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 90px">Direktur</td>
                        </tr>
                        <tr>
                            <td><b><u>dr. Akhmad Akhadi S., M.P.H.</u></b></td>
                        </tr>
                        <tr>
                            <td><b>NIP. 19680714 200012 1 002</b></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table style="font-family: Arial; line-height: 10px">
                        <tr>
                            <td colspan="2">Tembusan disampaikan kepada Yth.:</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px" >1. </td>
                            <td>Kepala Dinas Kesehatan DIY</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px" >2. </td>
                            <td>Kepala Badan Kepegawaian Daerah DIYKepala Badan Kepegawaian Daerah DIY</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px" >3. </td>
                            <td>Inspektur DIY</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px" >4. </td>
                            <td>Ka. Kantor Cabang PT.TASPEN (PERSERO) Yogyakarta</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px" >5. </td>
                            <td>Pertinggal</td>
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
