<!DOCTYPE html>
<html lang="en">

<head>
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    @else
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
    @endif
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css" media="print">
        @page {
            size: auto;
            /* auto is the initial value */
            margin: 0;
            /* this affects the margin in the printer settings */
        }
    </style>
    <style>
        .borderss {
            border-bottom: 1px solid black;
        }

        /* .space {
            padding-left: 100px;
            padding-bottom: 15px;
            width: 40%
        } */

        body {
            font-family: Tahoma, Geneva, sans-serif, Arial;
        }
    </style>
</head>

<body style="background-color: #CCCCCC">
    <div align="center">
        {{-- penting gais ini buat urlnya kalo localhost dan server itu beda --}}
        @foreach ($data as $tb)
        <table border="0" width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td width="2%">
                        <p align="left" style="margin: 0%">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/logo_grhasia.png') }}" style="width: 90px; padding-left: 40px; ">
                            @else
                            <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 90px; padding-left: 40px; ">
                            @endif
                            {{-- <font style="font-size: 10pt;" color="#000000" face="Arial"><b>RSJ GRHASIA</b></font><br> --}}
                        </p>
                        <p align="left" style="margin: 0%">
                            <font style="font-size: 10pt;  padding-left: 40px;" color="#000000" face="Arial"><b>RSJ
                                    GRHASIA</b></font><br>
                        </p>
                    </td>
                    <td width="48%" border="0">
                        <p align="left" style="margin: 0%">
                            <font style="font-size: 10pt;" color="#000000" face="Arial"><b>PEMERINTAH DAERAH DAERAH
                                    ISTIMEWA YOGYAKARTA</b></font><br>
                        </p>
                        <p align="left" style="margin: 0">
                            <font style="font-size: 10pt;" color="#000000" face="Arial"><b>DINAS KESEHATAN</b></font>
                            <br>
                        </p>
                        <p align="left" style="margin: 0">
                            <font style="font-size: 11pt;" color="#000000" face="Arial"><b>RUMAH SAKIT JIWA GRHASIA</b>
                            </font><br>
                        </p>
                        <p align="left" style="margin: 0">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/Aksara Jawa_Surat.png') }}" style="width: 170px; ">
                            @else
                            <img src="{{ asset('service/img/Aksara Jawa_Surat.png') }}" style="width: 170px; ">
                            @endif
                        </p>
                        <p align="left" style="margin: 0px;">
                            <font style="font-size: 8pt;line-height: 1px" color="#000000" face="Arial">
                                Jalan Kaliurang Km 17 Sleman, Telepon: (0274) 895143, 895297 <br>
                                Laman: grhasia.jogjaprov.go.id, Surel: <u>grhasiamentalhospital@gjogjaprov.go.id</u>
                            </font><br>
                        </p>

                    </td>
                    <td width="20%">
                        <p align="left" style=" padding-right: 40px">
                            <font style="font-size: 11pt; vertical-align: top;" color="#000000" face="Arial">
                                <b>CM.RJP.01.003/20{{$tb->nocm}}</b>
                            </font>
                        </p>
                        <p><br></p>
                        <p><br></p>
                        <p align="left" style=" margin-bottom: 0; padding-right: 40px">
                            <font style="font-size: 11pt; vertical-align: top;" color="#000000" face="Arial">
                                <b>Yogyakarta, {{$tb->tgl}}</b>
                            </font>
                        </p>

                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <p align="center" style="margin-right: 30px; margin-top: 0; margin-bottom:0">
                            <font style="font-size: 15pt; " color="#000000" face="Arial">
                                <u>
                                    <b>SURAT KETERANGAN DOKTER</b>
                                </u>
                            </font>
                            <br>
                            <font style="font-size: 13pt; vertical-align: top;" color="#000000" face="Arial">
                                <!-- <b>Nomor : </b>400.7.22.1 / {{$tb->nomor}} -->
                                <b>Nomor : </b>{{ $kodeawalsurat ?? '' }}{{$tb->nomor}}{{ $kodeakhirsurat ?? '' }}
                            </font>
                        </p>
                    </td>
                </tr>

            </thead>
            <table border="0" width="{{$pageWidth}}" bgcolor="#FFFFFF">
                <tr>
                    <td colspan="6" style="padding-left: 40px; padding-right: 40px" > Yang bertanda tangan di bawah ini, telah melakukan pemeriksaan kesehatan pada
                        tanggal {{$tb->tgl}}, terhadap : </td>
                </tr>
                <tr>
                    <td width="150" style="padding-left: 60px ">Nama</td>
                    <td width="1">:</td>
                    <td colspan="4">{{$tb->nama}}</td>
                </tr>
                <tr>
                    <td width="180" style="padding-left: 60px ">Tempat/Tanggal Lahir</td>
                    <td width="1">:</td>
                    <td width="250">{{$tb->tgllahir}}</td>
                    <td>Jenis Kelamin</td>
                    <td>:</td>
                    <td>{{$tb->jeniskelamin}}</td>
                </tr>
                <tr>
                    <td width="130" style="padding-left: 60px ">Pekerjaan</td>
                    <td width="1">:</td>
                    <td colspan="4">{{$tb->pekerjaan}}</td>
                </tr>
                <tr>
                    <td width="130" style="padding-left: 60px ">Alamat</td>
                    <td width="1">:</td>
                    <td colspan="4">{{$tb->alamat}}</td>
                </tr>
                <tr>
                    <td width="130" style="padding-left: 60px ">Pada waktu diperiksa</td>
                    <td  width="1">:</td>
                    <td>TB: {{$tb->tb}} cm</td>
                    <td>TD: {{$tb->td}} mmHg</td>                    
                </tr>
                <tr>
                    <td width="130" style="padding-left: 60px "></td>
                    <td></td>
                    <td>BB: {{$tb->bb}} kg</td>
                    <td>Nadi: {{$tb->nadi}} kali/menit</td>                    
                </tr>
                <tr>
                    <td width="130" style="padding-left: 60px ">Dalam Kondisi</td>
                    <td  width="1">:</td>
                    <td colspan="4">{{$tb->kondisi}}</td>
                </tr>
                <tr>
                    <td width="130" style="padding-left: 40px; padding-right: 40px" colspan="6">Demikian Surat Keterangan Dokter ini dibuat dengan sebenarnya untuk keperluan :  {{$tb->keperluan}}</td>
                </tr>
                <tr>
                    <td width="130" style="padding-left: 40px; padding-right: 40px" colspan="6">dan tidak dapat digunakan untuk kepentingan hukum lainnya.</td>
                    {{-- <td>{{$tb->keperluan}}</td> --}}
                </tr>
                <tr>
                    <td colspan="5"></td>
                    <td align="center" style="padding-right: 40px">Dokter yang memeriksa</td>
                </tr>
                <tr>
                    <td colspan="6"><br><br></td>
                </tr>
                <tr>
                    <td colspan="5"></td>
                    <td align="center" style="padding-right: 40px">{{substr($tb->dokter,strpos($tb->dokter, "~")+1)}}</td>
                </tr>
            </table>
        </table>
        @endforeach
    </div>
</body>

</html>