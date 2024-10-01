{{-- @extends('report.dom') --}}
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
                                    <td style="width: 100px;font-size: 13px; font-weight: bold">CM.RJP.01.003/20 {{isset($item[3003970]) ? $item[3003970] : '' }} 
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
                    SURAT KETERANGAN PEMERIKSAAN NAPZA
                </th>
            </tr>
            <tr>
                <th style=" font-size: 14px"> 
                    <p>Nomor :</p>
                    <p>{{ $item[3003972] ? $item[3003972] : '' }}</p>
                </th>
            </tr>
            <tr>
                <td><br></td>
            </tr>
        </table>

        <table style="padding-left: 1cm; width: 100%;">
            <tr>
                <td colspan="3" style="text-align:justify;"> 
                    Yang bertanda tangan di bawah ini, telah melakukan pemeriksaan NAPZA pada tanggal {{ isset($item[3003971]) ? $item[3003971] : '' }}, terhadap : 
                </td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px">Nama</td>
                <td style="width: 1%">:</td>
                <td>{{ isset($item[3003977]) ? $item[3003977] : '' }}</td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px">Tempat/Tanggal Lahir</td>
                <td style="width: 1%">:</td>
                <td>{{ isset($item[3003978]) ? $item[3003978] : '' }}</td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px">Jenis Kelamin</td>
                <td style="width: 1%">:</td>
                <td>{{ isset($item[3003979]) ? $item[3003979] : '' }}</td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px">Pekerjaan</td>
                <td style="width: 1%">:</td>
                <td>{{ isset($item[3003980]) ? $item[3003980] : '' }}</td>
            </tr>
            <tr>
                <td style="width: 35%; padding-left: 60px">Alamat</td>
                <td style="width: 1%">:</td>
                <td>{{ isset($item[3003981]) ? $item[3003981] : '' }}</td>
            </tr>
        </table>

        <table style="padding-left: 1cm; width: 100%">
            <tr>
                <td style="text-align:justify;">
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
                <td>Demikian Surat Keterangan Pemeriksaan NAPZA ini digunakan untuk keperluan : {{ isset($item[3003975]) ? $item[3003975] : '' }}</td>
            </tr>
            <tr>
                <td>dan tidak dapat digunakan untuk kepentingan hukum lainnya.</td>
            </tr>
        </table>
        
        {{-- dokter --}}
        <table style="padding-top: 2em; width:35%; margin-left: auto;">
            <tr>
                <td align="center">Dokter yang memeriksa</td>
            </tr>
            @if ($tte == 'true')
                <tr>
                    <td style="padding: 0 2em;">
                        <p style="text-align: center; color:grey;font-size: 16px;">
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
                <td align="center">{{ isset($item[3003976]) ? $item[3003976] : '' }}</td>
            </tr>
            
            {{-- NIP/SIP --}}
            <tr>
                <td style="text-align: center;">
                    NIP/SIP : 
                    @if (isset($peg->nip))
                        {{ $peg->nip }}
                    @else
                        {{ (isset($sip->nosip)) ? $sip->nosip : '' }}
                    @endif
                </td>
            </tr>
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

