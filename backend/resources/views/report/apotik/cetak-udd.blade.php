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
        <div style="display:inline-table;margin-right: 5px" >
            @foreach ($r['tglpelayanan'] as $rt)
            {{-- {{dd($r['pelayanan'])}} --}}
                <table  cellpadding="0"style="border-collapse: collapse;border: 1px solid black; margin-bottom: 9px; ">
                <tr>
                    <td height="25px" style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 11pt">{{$r['pelayanan']['pasien'][0]->namapasien}}</td>
                    <td rowspan="2" style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 9pt">TGL <br> {{date('d/m/Y', strtotime($rt->tglcetak))}}</td>
                </tr>
                <tr>
                    <td height="17px" style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: left; font-weight: bold; font-size: 9pt">TL :  {{date('d/m/Y', strtotime($r['pelayanan']['pasien'][0]->tgllahir))}}</td>
                </tr>
                <tr>
                    <td> 
                        <table style="font-family:Arial; font-size: 7pt">
                            @foreach ($r['pelayanan']['detailobat'] as $rpd)
                                <tr>
                                    <td width="100px" height="15px" >{{$rpd->namaproduk}}</td>
                                    <td width="27px" height="15px"style="text-align: center">{{$rpd->aturan}}</td>
                                    <td width="24px" height="15px">{{$rpd->satuan}}</td>
                                </tr>
                            @endforeach
                        </table>
                    </td>
                    <td id="waktu" height="75px"cellpadding="0"style=" border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 9pt">
                        {{$r['pelayanan']['waktu']}}
                    </td>
                </tr>
            </table>
            @endforeach
            
        </div>
    @endforeach





        {{-- @foreach ($detail as $d)
            <div style="display: grid;
  grid: 150px / auto auto auto;">

        @foreach ($d['date'] as $dt)
        @foreach ($d['pasien'] as $p)

                <table cellpadding="0"style="border-collapse: collapse;border: 1px solid black; margin-bottom: 10px" >
                <tr>
                    <td style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 12pt">{{$p->namapasien}}</td>
                    <td rowspan="2" style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 10pt"> TGL <br> {{date('d/m/Y',strtotime($dt->date))}}</td>
                </tr>
                <tr>
                    <td style="border-collapse: collapse;border: 1px solid black; font-family:Arial; font-weight: bold; font-size: 10pt">TL : {{date('d/m/Y', strtotime($p->tgllahir))}}</td>
                </tr>
                <tr>
                    <td>
                        <table>
                            @foreach ($d['obat'] as $ob)
                            <tr style="font-size: 8pt;">
                                <td style="width: 100px">{{$ob->namaproduk}}</td>
                                <td>{{$ob->aturan}}</td>
                                <td>{{$ob->satuan}}</td>
                            </tr>
                        @endforeach
                        </table>
                    </td>
                    <td style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center;  writing-mode: vertical-rl;text-orientation: upright;font-weight: bold; font-size: 10pt">{{$dt->waktu}}</td>
                </tr>
            </table>

        @endforeach
        @endforeach
            </div>

        @endforeach --}}
        
        {{-- @foreach ($detail as $d)
        @foreach ($d['date'] as $date)
            {{var_dump($date)}}
            
        @endforeach
        @endforeach --}}
        {{-- @foreach ($date as $date)
            <table cellpadding="0"style="border-collapse: collapse;border: 1px solid black; margin-bottom: 10px" >
                <tr>
                    <td style="border-collapse: collapse;border: 1px solid black; font-family:Arial; text-align: center; font-weight: bold; font-size: 12pt">{{$pasien[0]->namapasien}}</td>
                    <td style="border-collapse: collapse;border: 1px solid black;text-align: center" rowspan="2">TGL : <br>{{date('d/m/Y',strtotime($date->date))}}</td>
                </tr>
                <tr>
                    <td style="border-collapse: collapse;border: 1px solid black; font-weight: bold">TL: {{date('d/m/Y',strtotime($pasien[0]->tgllahir))}}</td>
                </tr>
                <tr>
                    <td>
                        <table>
                    @foreach ($data as $d)
                        <tr  >
                            <td>{{$d->namaproduk}}</td>
                            <td>{{$d->aturan}} </td>
                            <td>{{$d->satuanresep}}</td>
                        </tr>
                    @endforeach
                        </table>
                    </td>
                    <td style="border-collapse: collapse;border: 1px solid black; writing-mode: vertical-rl;text-orientation: upright;font-weight: bold">{{$waktu}}</td>

                </tr>
                    
            </table>
        @endforeach --}}
        {{-- <table cellspacing="0" cellpadding="0" border="0" width="100%" >
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/WhatsApp Image 2022-06-10 at 10.59.25.jpeg') }}" alt=""
                            style="width: 90px;">
                        @else
                        <img src="{{ asset('service/img/WhatsApp Image 2022-06-10 at 10.59.25.jpeg') }}" alt=""
                            style="width: 90px;">
                        @endif

                    </td>
                    <td style="text-align: center; font-family: Arial">

                        <span style="font-size: 12pt">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</span></br>
                        <span style="font-size: 16pt;">DINAS KESEHATAN</span><br>
                        <span style="font-size: 14pt;">RUMAH SAKIT JIWA GRHASIA</span><br>
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/Aksara Jawa_Surat.png') }}" alt="" style="width: 170px;">
                        @else
                        <img src="{{ asset('service/img/Aksara Jawa_Surat.png') }}" alt="" style="width: 170px;">
                        @endif <br>
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
                    
                </tr>
            </tbody>
        </table> --}}
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
