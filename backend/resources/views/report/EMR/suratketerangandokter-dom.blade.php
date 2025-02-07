{{-- @extends('report.dom') --}}
@php
    function toUppercase($string) {
        $string = str_replace(['-', '_'], ' ', $string); 
        return ucwords(strtolower($string));
    }
@endphp
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
            position: fixed;
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
                    {{-- <tr>
                        <td width="10%" style="padding: 5px">
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin-bottom:10px">
                                <br>
                                <b >
                                    <span style="font-size: 10px;"> RSJ GRHASIA</span>

                                </b>
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
                    </tr> --}}

                    {{-- kop baru --}}
                    <tr>
                        <td style="border-bottom:3px solid black; padding-bottom:1em; width: 15%;">
                            <img src="img/diy.png" alt="Logo" style="width: 100%;">
                        </td>
                        <td style="border-bottom:3px solid black; padding-bottom:1em; text-align:center;">
                            <p style="margin:0; padding:0;">{{ $res['profile']->baris1 }}</p>
                            <p style="font-weight:bold; margin:0; padding:0;">{{ $res['profile']->baris2 }}</p>
                            <p style="font-weight:bold; margin:0; margin-bottom:.3cm; padding:0;">{{ strtoupper($res['profile']->namalengkap) }}</p>
                            <img src="img/aksara_jawa-com.png" alt="Logo" style="height: .8cm;">
                            <p style="font-size:8pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos }}, Telepon: (0274) 895143, 895297</p>
                            <p style="font-size:8pt; margin:0;">Faksimile: {{ $res['profile']->faksimile }}, Pos-el: <span style="text-decoration:underline; color:blue;">{{ $res['profile']->alamatemail }}</span>,</p>
                            <p style="font-size:8pt; margin:0;">Laman: {{ $res['profile']->website }}</p>
                        </td>
                        <td style="border-bottom:3px solid black; padding-bottom:1em; width: 25%;">
                            <img src="img/logo_grhasiafull.png" alt="Logo" style="width: 100%;">
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
                    <th style=" font-size: 14px">Nomor : {{ $kodeawalsurat ?? '' }} {{isset($item[3003992]) ? $item[3003992] : '' }} {{ $kodeakhirsurat ?? '' }}</th>
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
                                <td>{{ toUppercase($item[3003982]) }}</td>
                            </tr>
                            <tr>
                                <td width="30%" style="padding-left: 60px ">Tempat/Tanggal Lahir</td>
                                <td width="1%">:</td>
                                <td width="250">
                                <table>
                                    <tr>
                                        <td>{{toUppercase($item[3003983])}} </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </table>
                                </td>
                                
                            </tr>
                            <tr>
                                <td width="30%"  style="padding-left: 60px ">Jenis Kelamin</td>
                                <td width="1%">:</td>
                                <td>{{toUppercase($item[3003984])}}</td>
                            </tr>
                            <tr>
                                <td width="30%"  style="padding-left: 60px ">Pekerjaan</td>
                                <td width="1%">:</td>
                                <td>{{toUppercase($item[3003985])}}</td>
                            </tr>
                            <tr>
                                <td width="30%" style="padding-left: 60px ">Alamat</td>
                                <td width="1%">:</td>
                                <td>{{toUppercase($item[3003986])}}</td>
                            </tr>
                            <tr>
                            <td width="30%" style="padding-left: 60px;">Pada waktu diperiksa</td>
                            <td width="1%">:</td>
                            <td>
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="width: 150px;">TB: {{ isset($item[3003993]) ? $item[3003993] : '' }} cm</td>
                                        <td style="width: 150px; padding-left: 50px;">TD: {{ isset($item[3003994]) ? $item[3003994] : '' }} mmHg</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 150px;">BB: {{ $item[3003995] }} kg</td>
                                        <td style="width: 150px; padding-left: 50px;">Nadi: {{ $item[3003996] }} kali/menit</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 150px;">Imt: {{ $item[901308931] }} kg/m²</td>
                                        <td style="width: 150px; padding-left: 50px;"></td>
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
                            <td style="text-align: center;">
                                <b>Dokter yang memeriksa</b>
                            </td>
                        </tr>
                        @if ($tte == 'true')
                            <tr>
                                <td>
                                    <p style="text-align: center; color:grey;">
                                        Ditandatangani Secara 
                                        <br>Elektronik
                                    </p>
                                </td>
                            </tr>
                        @else
                            <tr>
                                <td style="padding: 2em 0;">
                                    
                                </td>
                            </tr>
                        @endif
                        <tr>
                            <td style="text-align: center">
                                {{-- <br>{!! $res['d'][0]->namadokter == null ? ($peg!=null?$peg->namalengkap:'-'): $res['d'][0]->namadokter !!} --}}
                                <br>{!! $item[3003998] !!}
                            </td>
                        </tr>

                        {{-- jika ada nip tampilkan nip jika tidak tampilkan siip --}}
                        @if (isset($peg->nippns) && $peg->nippns)
                            <tr>
                                <td style="text-align: center">
                                    NIP: {{ $peg->nippns }}
                                </td>
                            </tr>
                            @endif

                            @if (isset($sip->nosip) && $sip->nosip)
                            <tr>
                                <td style="text-align: center">
                                    SIP: {{ $sip->nosip }}
                                </td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>
        </section>
        {{-- <p
        style="font-size:10px;color: rgb(173, 173, 173); position: absolute; bottom: 10%; left: 3%; width: 50%; text-align: center;">
            <i>Dokumen ini ditandatangani secara elektronik menggunakan sertifikat elektronik
                yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara</i></p> --}}
        
    @if ($tte == 'true')
        <div class="footer3">
            <table border="0">
                <tr>
                    <td style="width: 15%; text-align:center;">
                        <img src="img/bsre.png" alt="Logo" style="width: 50%; object-fit:contain; object-position:center; margin-bottom:10px;">
                    </td>
                    <td style="width: 15%; text-align: center;">
                        <p>$</p>
                    </td>
                    <td style="width: 70%;">
                        <p><i>Dokumen ini ditandatangani secara elektronik menggunakan sertifikat elektronik
                            yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara</i></p>
                    </td>
                </tr>
            </table>
        </div>
    @endif
    </body>
</html>

