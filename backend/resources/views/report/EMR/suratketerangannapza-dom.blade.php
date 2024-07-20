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
                <td>{{ $item[1901301360] ? $item[1901301360] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 25%;">Hubungan</td>
                <td width="1%">:</td>
                <td>{{ $item[1901301370] ? $item[1901301370] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 25%;">Alamat</td>
                <td width="1%">:</td>
                <td>{{ $item[1901301380] ? $item[1901301380] : null }}</td>
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
                <td>Dokter Penanggung Jawab</td>
            </tr>
            <tr>
                <td style="padding: 0 2em;">
                    <p style="text-align: center; color:grey;font-family: 'Times New Roman', Times, serif;font-size: 16px;">
                        Ditandatangani Secara 
                        <br>Elektronik
                    </p>
                </td>
            </tr>
            <tr>
                @php
                    $string = $item[1901301450];
                    $split = explode('~', $string);
                @endphp
                <td>
                    <p>{{ end($split) }}</p>
                </td>
            </tr>
        </table>

        {{-- footer bsre --}}
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
    </section>
</body>
</html>

