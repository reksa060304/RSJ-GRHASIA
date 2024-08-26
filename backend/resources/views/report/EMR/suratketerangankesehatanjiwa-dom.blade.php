<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Surat Keterangan Pemeriksaan Kesehatan Jiwa</title>
    
    <link rel="stylesheet" href="css/report/paper.css">
    <link rel="stylesheet" href="css/report/table.css">
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
    <section style="font-family:Arial; font-size:10pt; margin: 1cm 1.5cm;">
        {{-- Kop --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td width="10%">
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
                            <span style="font-size: 12px;">RS JIWA GRHASIA</span>
                            <br>
                            <div style="padding: .2em 0;">
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 150px;">
                            </div>
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
                                    <td style="width: 100px;font-size: 13px; font-weight: bold">CM.RJP.01.003/20 {{isset($item[3003950]) ? $item[3003950] : '' }} 
                                        <br><br><br> <br><br><br></td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        {{-- awalan --}}
        <table cellspacing="0" cellpadding="0" width="100%" style="margin-top: 1em; text-align:center;">
            <tr>
                <td style="font-size:14pt; font-weight:bold; text-decoration:underline;">
                    SURAT KETERANGAN PEMERIKSAAN KESEHATAN JIWA
                </td>
            </tr>
            <tr>
                <td> 
                    Nomor : {{ $item[3003952] ? $item[3003952] : '' }}
                </td>
            </tr>
            <tr>
                <td style="padding-top: 1em;">
                    Yang bertanda tangan di bawah ini, telah melakukan pemeriksaan psikiatrik pada tanggal {{ $item[3003951] ? $item[3003951] : '' }}, terhadap :
                </td>
            </tr>
        </table>

        {{-- pasien --}}
        <table cellspacing="0" cellpadding="0" width="100%" style="padding: 0 3em; margin: 1em 0;">
            <tr>
                <td style="width: 40%">Nama</td>
                <td style="width: 1%">:</td>
                <td>{{ $item[3003957] ? $item[3003957] : '' }}</td>
            </tr>
            <tr>
                <td style="width: 40%">Tempat/Tanggal Lahir</td>
                <td style="width: 1%">:</td>
                <td>{{ $item[3003958] ? $item[3003958] : '' }}</td>
            </tr>
            <tr>
                <td style="width: 40%">Jenis Kelamin</td>
                <td style="width: 1%">:</td>
                <td>{{ $item[3003959] ? $item[3003959] : '' }}</td>
            </tr>
            <tr>
                <td style="width: 40%">Pekerjaan</td>
                <td style="width: 1%">:</td>
                <td>{{ $item[3003960] ? $item[3003960] : '' }}</td>
            </tr>
            <tr>
                <td style="width: 40%">Alamat</td>
                <td style="width: 1%">:</td>
                <td>{{ $item[3003961] ? $item[3003961] : '' }}</td>
            </tr>
        </table>

        {{-- ditemukan / tidak ditemukan --}}
        <table cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td>
                    Dengah Hasil Pemeriksaan Kesehatan Jiwa pada saat ini : 
                    @if ( isset($item[3003953]) && $item[3003953] == true) DITEMUKAN @else <s>DITEMUKAN</s>
                    @endif / @if (isset($item[3003954]) && $item[3003954] == true) TIDAK DITEMUKAN @else <s>TIDAK DITEMUKAN</s>
                    @endif TANDA DAN GEJALA GANGGUAN JIWA BERMAKNA YANG DAPAT MENGGANGGU AKTIVITAS KEHIDUPAN SEHARI-HARI.
                </td>
            </tr>
            <tr>
                <td>
                    Demikian Surat Keterangan Pemeriksaan Kesehatan Jiwa ini dibuat dengan sebenarnya untuk keperluan : {{ $item[3003955] ? $item[3003955] : '' }}</td>
            </tr>
            <tr>
                <td>dan tidak dapat digunakan untuk kepentingan hukum lainnya.</td>
            </tr>
        </table>

        <table style="margin-top: 3em; width: 30%; margin-left:auto;">
            <tr>
                <td>Dokter yang memeriksa</td>
            </tr>
            @if ($tte == 'true')
                <tr>
                    <td>
                        <p style="color:grey;font-family: 'Times New Roman', Times, serif;font-size: 16px;">
                            Ditandatangani Secara 
                            <br>Elektronik
                        </p>
                    </td>
                </tr>
            @else
            <tr>
                <td style="padding: 3em 0em;">
                    
                </td>
            </tr>
            @endif
            <tr>
                <td>{{ $item[3003956] ? $item[3003956] : '' }}</td>
            </tr>
        </table>

    </section>

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