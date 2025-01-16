{{-- @extends('report.dom') --}}
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Surat Keterangan Rehabilitasi NAPZA</title>
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">
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
                                    <td style="width: 100px;font-size: 13px; font-weight: bold">CM.RJP.01.003/20 {{isset($item[1901301320]) ? $item[1901301320] : '' }} 
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
        
        {{-- awalan --}}
        <table width="100%"  style="margin-top: 10px" cellspacing="0" cellpadding="0">
            <tr>
                <th style="text-decoration: underline; font-size: 15px">
                    SURAT KETERANGAN REHABILITASI MEDIS NAPZA
                </th>
            </tr>
            <tr>
                <th style=" font-size: 14px"> 
                    <p>Nomor :</p>
                    <p>{{ $item[1901301300] ? $item[1901301300] : '' }}</p>
                </th>
            </tr>
            <tr>
                <td><br></td>
            </tr>
            <tr>
                <td style="font-weight: bold;" colspan="6">
                    Dengan ini kami menerangkan bahwa:
                </td>
            </tr>
        </table>

        {{-- Pasien --}}
        <table style="width: 100%; margin-left: 4em; margin-top: 1em;">
            <tr>
                <td style="font-weight: bold; width: 25%;">Nama</td>
                <td width="1%">:</td>
                <td>{{ $item[1901301310] ? $item[1901301310] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 25%;">Nomor RM</td>
                <td width="1%">:</td>
                <td>{{ $item[1901301320] ? $item[1901301320] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 25%;">Umur</td>
                <td width="1%">:</td>
                <td>{{ $item[1901301330] ? $item[1901301330] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 25%;">Jenis Kelamin</td>
                <td width="1%">:</td>
                <td>{{ $item[1901301340] ? $item[1901301340] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 25%;">Alamat</td>
                <td width="1%">:</td>
                <td>{{ $item[1901301350] ? $item[1901301350] : null }}</td>
            </tr>
        </table>

        <table style="width: 100%; margin-left: 4em; margin-top: 1em;">
            <tr>
                <td colspan="2" style="font-weight: bold;">Dengan penannggungjawab :</td>
            </tr>
        </table>

        {{-- Penanggung jawab --}}
        <table style="width: 100%; margin-left: 4em; margin-top: 1em;">
            <tr>
                <td style="font-weight: bold; width: 25%;">Nama</td>
                <td width="1%">:</td>
                <td>{{ isset($item[1901301360]) ? $item[1901301360] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 25%;">Hubungan</td>
                <td width="1%">:</td>
                <td>{{ isset($item[1901301370]) ? $item[1901301370] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 25%;">Alamat</td>
                <td width="1%">:</td>
                <td>{{ isset($item[1901301380]) ? $item[1901301380] : null }}</td>
            </tr>
        </table>

        {{-- Pengobatan --}}
        <table style="width: 100%; margin-left: 4em; margin-top: 1em;">
            <tr>
                <td>
                    Menjalani pengobatan dan rehabilitasi medis NAPZA {{ $item[1901301390] ? $item[1901301390] : null }} 
                    di RSJ Grhasia DIY Selama {{ $item[1901301400] ? $item[1901301400] : null }} hari, 
                    terhitung mulai tanggal {{ $item[1901301410] ? $item[1901301410] : null }} samapi dengan
                    {{ $item[1901301420] ? $item[1901301420] : null }}
                </td>
            </tr>
        </table>

        <table style="width: 100%; margin-left: 4em; margin-top: 1em">
            <tr>
                <td style="margin-top: 1em;">Catatan Selama menjalani program:</td>
            </tr>

            <tr>
                <td>{{ $item[1901301430] ? $item[1901301430] : null }}</td>
            </tr>
        </table>

        <table style="width: 100%; margin-left: 4em; margin-top: 1em">
            <tr>
                <td>Demikian surat keterangan ini kami buat untuk dapat dipergunakan sebagaimana mestinya.</td>
            </tr>
        </table>
        
        {{-- tanda tangan --}}
        <table style="margin-top: 2em; width: 40%; margin-left: auto; text-align:center;">
            <tr>
                <td>Yogyakarta, {{ $item[1901301440] ? $item[1901301440] : null }}</td>
            </tr>
            <tr>
                <td>Dokter Penanggung Jawab {{ $tte }}</td>
            </tr>
            @if ($tte == 'true')
                <tr>
                    <td style="padding: 0em 2em;">
                        <p style="text-align: center; color:grey;font-size: 16px;">
                            Ditandatangani Secara 
                            <br>Elektronik
                        </p>
                    </td>
                </tr>
            @else
                <tr>
                    <td style="padding: 4em 0em;">
                        <p style="text-align: center; color:grey;font-size: 16px;">
                            
                        </p>
                    </td>
                </tr>
            @endif
            <tr>
                @php
                    $string = $item[1901301450];
                    $split = explode('~', $string);
                @endphp
                <td>
                    <p>{{ end($split) }}</p>
                </td>
            </tr>

            {{-- NIP/SIP --}}
            <tr>
                <td>
                    NIP/SIP : 
                    @if (isset($peg->nippns))
                        {{ $peg->nippns }} {{ (isset($sip->nosip)) ? ' / '.$sip->nosip : '' }}
                    @else
                        {{ (isset($sip->nosip)) ? $sip->nosip : '' }}
                    @endif
                </td>
            </tr>
        </table>

        {{-- footer bsre --}}
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
    </section>
</body>
</html>

