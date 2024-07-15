{{-- @extends('report.dom') --}}
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Resume Medis</title>
    {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">
    {{-- @else
        <link rel="stylesheet" href="service/css/report/paper.css">
        <link rel="stylesheet" href="service/css/report/table.css">
        <link rel="stylesheet" href="service/css/report/tabel.css">

        <link href="service/css/style.css" rel="stylesheet">
    @endif --}}

    <style>
        @page {
            size:A4
        }
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
        .footer2 {
            text-align: center;
            position: absolute;
            left: 67%;
            bottom: 30%;
            right: 3%;
            }
        .footer3 {
            text-align: center;
            position: absolute;
            left: 1%;
            bottom: 10%;
            right: 1%;
            }

        footer {
            text-align: center;
            position: absolute;
            bottom: 0;
            right: 5%;
        }
        footer {
            position: fixed;
            bottom: 0;
        }
    </style>

</head>
<body>
        <section style="font-family:Arial;padding:10mm">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin-bottom:10px">
                                <br>
                                <b >
                                    <span style="font-size: 10px;"> RSJ GRHASIA</span>

                                </b>
                            {{-- @else --}}
                                {{-- <img src="service/img/logo_only.png" alt="" style="width: 90px;"> --}}
                            {{-- @endif --}}
                        </td>
                        <td style="text-align: left">
                            <b>
                                <span style="font-size: 10px;">{!! $res['profile']->baris1 !!}</span>
                                <br>
                                <span style="font-size: 12px;">{!! $res['profile']->baris2 !!}</span>
                                <br>
                                <span style="font-size: 12px;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                                <br>
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 150px;">
                                <br>
                                <span style="font-size: 8px; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                                </span>

                            </b>
                        </td>
                        <td width="20%" >
                            <div style="text-align: right">
                                <table>
                                    <tr>
                                        <td style="width: 100px;font-size: 13px; font-weight: bold">CM.RJP.01.003/20 {{isset($item[3003990]) ? $item[3003990] : '' }} 
                                            <br><br><br> <br><br><br></td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>
            <br>
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="100%" >
                            <div style="text-align: right; margin-left:12cm">
                                <table>
                                    <tr>
                                        <td style="width: 100px;font-size: 13px; font-weight: bold;">Yogyakarta, {{$item[3003991]}} 
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                </tbody>
            </table>

            <table width="100%"  style="margin-top: 10px" cellspacing="0" cellpadding="0" 
                style="margin-left: 2px">
                <tr>
                    <th style="text-decoration: underline; font-size: 15px">SURAT KETERANGAN DOKTER</th>
                </tr>
                <tr>
                    <th style=" font-size: 14px">Nomor : 400.7.22.1 / {{isset($item[3003992]) ? $item[3003992] : '' }} </th>
                </tr>
                <tr>
                    <td><br></td>
                </tr>
                <tr>
                    <td colspan="6" style="padding-left: 40px; padding-right: 40px" > Yang bertanda tangan di bawah ini, telah melakukan pemeriksaan kesehatan pada
                        tanggal {{$item[3003987]}}, terhadap : </td>
                </tr>
                <tr>
                    <td>
                        <table border="0" width="{{$pageWidth}}" bgcolor="#FFFFFF">
                            <tr>
                                <td width="30%" style="padding-left: 60px ">Nama</td>
                                <td width="1%">:</td>
                                <td>{{$item[3003982]}}</td>
                            </tr>
                            <tr>
                                <td width="30%" style="padding-left: 60px ">Tempat/Tanggal Lahir</td>
                                <td width="1%">:</td>
                                <td width="250">
                                <table>
                                    <tr>
                                        {{-- <td></td> --}}
                                        <td>{{$item[3003983]}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </table>
                                </td>
                                
                            </tr>
                            <tr>
                                <td width="30%"  style="padding-left: 60px ">Jenis Kelamin</td>
                                <td width="1%">:</td>
                                <td>{{$item[3003984]}}</td>
                            </tr>
                            <tr>
                                <td width="30%"  style="padding-left: 60px ">Pekerjaan</td>
                                <td width="1%">:</td>
                                <td>{{$item[3003985]}}</td>
                            </tr>
                            <tr>
                                <td width="30%" style="padding-left: 60px ">Alamat</td>
                                <td width="1%">:</td>
                                <td >{{$item[3003986]}}</td>
                            </tr>
                            <tr>
                                <td  width="30%"style="padding-left: 60px ">Pada waktu diperiksa</td>
                                <td  width="1%">:</td>
                                <td>
                                    <table>
                                        <tr>
                                            <td>TB: {{$item[3003993]}} cm</td>
                                            <td style="padding-left: 100px">TD: {{$item[3003994]}} mmHg</td>
                                            
                                        </tr>
                                        <tr>
                                            <td >BB: {{$item[3003995]}} kg</td>
                                            <td style="padding-left: 100px">Nadi: {{$item[3003996]}} kali/menit</td>   
                                        </tr>
                                    </table>
                                </td>                    
                            </tr>
                            <tr>
                                <td  width="30%" style="padding-left: 60px ">Dalam Kondisi</td>
                                <td  width="1%">:</td>
                                <td>{{$item[3003999]}}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 40px; padding-right: 40px" colspan="6">Demikian Surat Keterangan Dokter ini dibuat dengan sebenarnya untuk keperluan : </td>
                            </tr>
                            <tr>
                                <td style="padding-left: 40px; padding-right: 40px" colspan="6">{{$item[3003997]}} </td>
                            </tr>
                            <tr>
                                <td style="padding-left: 40px; padding-right: 40px" colspan="6">dan tidak dapat digunakan untuk kepentingan hukum lainnya.</td>
                                {{-- <td>{{$tb->keperluan}}</td> --}}
                            </tr>
                            <tr>
                                <td><br></td>
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
                                <td align="center" style="padding-right: 40px">{{$item[3003998]}}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
            </table>

            <div class="footer2 ">
                <table>
                    <tbody>
                        <tr>
                            <td width="33%" style="text-align: center"> </td>
                            <td width="33%"></td>
                            <td width="33%">
                                <b>Dokter yang memeriksa</b>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td height="100px">
                                <p style="text-align: center; color:grey;font-family: 'Times New Roman', Times, serif;font-size: 16px;">
                                    Ditandatangani Secara 
                                    <br>Elektronik
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center"></td>
                            <td style="text-align: center">&nbsp;</td>
                            <td style="text-align: center">
                                {{-- <br>{!! $res['d'][0]->namadokter == null ? ($peg!=null?$peg->namalengkap:'-'): $res['d'][0]->namadokter !!} --}}
                                <br>{!! $item[3003998] !!}
                            </td>
                        </tr>
                      
                    </tbody>
                </table>
            </div>
        </section>
        {{-- <img src="img/bsre.png" alt="Logo" style="width: 50px; margin-bottom:10px"> --}}
        <div class="footer3">
            <table>
                <tr>
                    <td>
                        <img src="img/bsre.png" alt="Logo" style="width: 8%; margin-left: 40px; margin-bottom: 38px;">
                    </td>
                    <td style="text-align: center">
                        <p>ä</p>
                    </td>
                    {{-- <td> --}}
                        {{-- <img src="img/qrcode.png" alt="Logo" style="width: 10%;"> --}}
                        
                    {{-- </td> --}}
                    <td>
                        <p><i>Dokumen ini ditandatangani secara elektronik menggunakan sertifikat elektronik
                            yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara</i></p>
                    </td>
                </tr>
            </table>
        </div>
        {{-- <p
        style="font-size:10px;color: rgb(173, 173, 173); position: absolute; bottom: 10%; left: 3%; width: 50%; text-align: center;">
            <i>Dokumen ini ditandatangani secara elektronik menggunakan sertifikat elektronik
                yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara</i></p> --}}
    </body>
</html>

