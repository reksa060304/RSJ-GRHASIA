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
    <title>SURAT KETERANGAN PEMERIKSAAN NAPZA</title>
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">

    <style>
        @page {
            size:A4;
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
        .footer3 {
            text-align: center;
            position: fixed;
            left: 1%;
            bottom: 10%;
            right: 1%;
        }
    </style>

</head>
<body>
    <section style="font-family:Arial; padding:10mm;">
        {{-- Kop --}}
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
                            <span style="font-size: 10px;">{!! $profile->baris1 !!}</span>
                            <br>
                            <span style="font-size: 12px;">{!! $profile->baris2 !!}</span>
                            <br>
                            <span style="font-size: 12px;">{!! strtoupper($profile->namalengkap) !!}</span>
                            <br>
                            <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 150px;">
                            <br>
                            <span style="font-size: 8px; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon: {!!$profile->fixedphone!!}
                            <br style="margin: 0px">
                            Laman: {!!$profile->website!!}, Surel: {!!$profile->alamatemail!!}
                            </span>

                        </b>
                    </td>
                    <td width="20%" >
                        <div style="text-align: right">
                            <table>
                                <tr>
                                    <td style="width: 100px;font-size: 13px; font-weight: bold">CM.RJP.01.003/20 {{isset($item[3003970]) ? $item[3003970] : '' }} 
                                        <br><br><br> <br><br><br></td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr> --}}

                {{-- Kop baru --}}
                <tr>
                    <td style="border-bottom:3px solid black; padding-bottom:1em; width: 15%;">
                        <img src="img/diy.png" alt="Logo" style="width: 100%;">
                    </td>
                    <td style="border-bottom:3px solid black; padding-bottom:1em; text-align:center;">
                        <p style="margin:0; padding:0; font-size: 12px;">{{ $res['profile']->baris1 }}</p>
                        <p style="font-weight:bold; margin:0; padding:0; font-size: 12px;">{{ $res['profile']->baris2 }}</p>
                        <p style="font-weight:bold; margin:0; margin-bottom:.3cm; padding:0; font-size: 12px;">{{ strtoupper($res['profile']->namalengkap) }}</p>
                        <img src="img/aksara_jawa-com.png" alt="Logo" style="height: .8cm;">
                        <p style="font-size: 10px; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos }}, Telepon: (0274) 895143, 895297</p>
                        <p style="font-size: 10px; margin:0;">Faksimile: {{ $res['profile']->faksimile }}, Pos-el: <span style="text-decoration:underline; color:blue;">{{ $res['profile']->alamatemail }}</span>,</p>
                        <p style="font-size: 10px; margin:0;">Laman: {{ $res['profile']->website }}</p>
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
                    <td width="100%">
                        <div style="text-align: right; margin-left:12cm">
                            <table>
                                <tr>
                                    <td style="width: 100px; font-size: 12px; font-weight: bold;">Yogyakarta, {{$item[3003971]}}</td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        {{-- awalan --}}
        <table width="100%" style="margin-top: 10px" cellspacing="0" cellpadding="0">
            <tr>
                <th style="text-decoration: underline; font-size: 20px;">
                    SURAT KETERANGAN PEMERIKSAAN NAPZA
                </th>
            </tr>
            <tr>
                <th style="font-size: 12px;">
                    <p>Nomor : {{ $kodeawalsurat ?? '' }}{{ $item[3003972] ? $item[3003972] : '' }}{{ $kodeakhirsurat ?? '' }}</p>
                </th>
            </tr>
            <tr>
                <td><br></td>
            </tr>
        </table>

        <table style="padding-left: 1cm; width: 100%;">
            <tr>
                <td colspan="3" style="text-align:justify; font-size: 12px;">
                    Yang bertanda tangan di bawah ini, telah melakukan pemeriksaan NAPZA pada tanggal {{ isset($item[3003971]) ? $item[3003971] : '' }}, terhadap :
                </td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px; font-size: 12px;">Nama</td>
                <td style="width: 1%; font-size: 12px;">:</td>
                <td style="font-size: 12px;">{{ toUppercase($item[3003977]) ?? '' }}</td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px; font-size: 12px;">Tempat/Tanggal Lahir</td>
                <td style="width: 1%; font-size: 12px;">:</td>
                <td style="font-size: 12px;">{{ toUppercase($item[3003978]) ?? '' }}</td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px; font-size: 12px;">Jenis Kelamin</td>
                <td style="width: 1%; font-size: 12px;">:</td>
                <td style="font-size: 12px;">{{ toUppercase($item[3003979]) ?? '' }}</td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px; font-size: 12px;">Pekerjaan</td>
                <td style="width: 1%; font-size: 12px;">:</td>
                <td style="font-size: 12px;">{{ toUppercase($item[3003980]) ?? '' }}</td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px; font-size: 12px;">Alamat</td>
                <td style="width: 1%; font-size: 12px;">:</td>
                <td style="font-size: 12px;">{{ toUppercase($item[3003981]) ?? '' }}</td>
            </tr>
        </table>

        <table style="padding-left: 1cm; width: 100%">
            <tr>
                <td style="text-align:justify; font-size: 12px;">
                    Dengah Hasil NAPZA menunjukkan :
                    @if (isset($item[3003973]) && $item[3003973] == true)
                        ADA
                    @else
                        <s>ADA</s>
                    @endif
                    /
                    @if (isset($item[3003974]) && $item[3003974] == true)
                        TIDAK ADA
                    @else
                        <s>TIDAK ADA</s>
                    @endif
                    TANDA DAN GEJALA PENGGUNAAN NAPZA.
                </td>
            </tr>

            <tr>
                <td style="font-size: 12px;">Demikian Surat Keterangan Pemeriksaan NAPZA ini digunakan untuk keperluan : {{ isset($item[3003975]) ? $item[3003975] : '' }}</td>
            </tr>
            <tr>
                <td style="font-size: 12px;">dan tidak dapat digunakan untuk kepentingan hukum lainnya.</td>
            </tr>
        </table>

        {{-- dokter --}}
        <table style="padding-top: 2em; width:35%; margin-left: auto;">
            <tr>
                <td align="center" style="font-size: 12px;">Dokter yang memeriksa</td>
            </tr>
            @if ($tte == 'true')
                <tr>
                    <td style="padding: 0 2em;">
                        <p style="text-align: center; color:grey; font-size: 12px;">
                            Ditandatangani Secara<br>Elektronik
                        </p>
                    </td>
                </tr>
            @else
            <tr>
                <td style="padding: 3em 0;"></td>
            </tr>
            @endif
            <tr>
                <td align="center" style="font-size: 12px;">{{ isset($item[3003976]) ? $item[3003976] : '' }}</td>
            </tr>

            {{-- jika ada nip tampilkan nip jika tidak tampilkan siip --}}
            @if (isset($peg->nippns) && $peg->nippns)
                <tr>
                    <td style="text-align: center; font-size: 12px;">
                        NIP: {{ $peg->nippns }}
                    </td>
                </tr>
            @endif

            @if (isset($sip->nosip) && $sip->nosip)
                <tr>
                    <td style="text-align: center; font-size: 12px;">
                        SIP: {{ $sip->nosip }}
                    </td>
                </tr>
            @endif
        </table>
    </section>

    {{-- footer bsre --}}
    @if ($tte == 'true')
        <footer class="footer3">
            <table>
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
        </footer>
    @endif
</body>
</html>

