@php
    function toUppercase($string) {
        $string = str_replace(['-', '_'], ' ', $string); 
        return ucwords(strtolower($string));
    }
@endphp
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
                {{-- <tr>
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
                </tr> --}}

                {{-- kop baru --}}
                <tr>
                    <td style="border-bottom:3px solid black; padding-bottom:1em; width: 15%;">
                        <img src="img/diy.png" alt="Logo" style="width: 100%;">
                    </td>
                    <td style="border-bottom:3px solid black; padding-bottom:1em; text-align:center;">
                        <p style="margin:0; padding:0;">{{ $profile->baris1 }}</p>
                        <p style="font-weight:bold; margin:0; padding:0;">{{ $profile->baris2 }}</p>
                        <p style="font-weight:bold; margin:0; margin-bottom:.3cm; padding:0;">{{ strtoupper($profile->namalengkap) }}</p>
                        <img src="img/aksara_jawa-com.png" alt="Logo" style="height: .8cm;">
                        <p style="font-size:8pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $profile->kodepos }}, Telepon: (0274) 895143, 895297</p>
                        <p style="font-size:8pt; margin:0;">Faksimile: {{ $profile->faksimile }}, Pos-el: <span style="text-decoration:underline; color:blue;">{{ $profile->alamatemail }}</span>,</p>
                        <p style="font-size:8pt; margin:0;">Laman: {{ $profile->website }}</p>
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
                                        <td style="width: 100px;font-size: 13px; font-weight: bold;">Yogyakarta, {{$item[3003951]}} 
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                </tbody>
            </table>

        {{-- Awalan --}}
        <table cellspacing="0" cellpadding="0" width="100%" style="margin-top: 1em; text-align:center; border-collapse: collapse;">
            <tr>
                <td style="font-size:14pt; font-weight:bold; text-decoration:underline;">
                    SURAT KETERANGAN PEMERIKSAAN KESEHATAN JIWA
                </td>
            </tr>
            <tr>
                <td style="padding-top: 0.5em;">
                    Nomor: {{ $kodeawalsurat ?? '' }} {{ $item[3003952] ?? '' }} {{ $kodeakhirsurat ?? '' }}
                </td>
            </tr>
            <tr>
                <td style="padding-top: 1em; text-align: justify;">
                    Yang bertanda tangan di bawah ini, telah melakukan pemeriksaan psikiatrik pada tanggal {{ $item[3003951] ?? '' }}, terhadap:
                </td>
            </tr>
        </table>

        {{-- Pasien --}}
        <table cellspacing="0" cellpadding="5" width="100%" style="margin: 1em 0; padding: 0 3em; text-align: left; border-collapse: collapse;">
            <tr>
                <td style="width: 30%; text-align: left;">Nama</td>
                <td style="width: 2%; text-align: center;">:</td>
                <td style="width: 68%; text-align: left;">{{ toUppercase($item[3003957] ?? '') }}</td>
            </tr>
            <tr>
                <td>Tempat/Tanggal Lahir</td>
                <td style="text-align: center;">:</td>
                <td>{{ toUppercase($item[3003958] ?? '') }}</td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td style="text-align: center;">:</td>
                <td>{{ toUppercase($item[3003959] ?? '') }}</td>
            </tr>
            <tr>
                <td>Pekerjaan</td>
                <td style="text-align: center;">:</td>
                <td>
                    @if (($item[3003960] ?? '') === 'LAIN-LAIN')
                        {{ toUppercase($item[3003960] ?? '') }} - {{ toUppercase($item[1901308921] ?? '') }}
                    @else
                        {{ toUppercase($item[3003960] ?? '') }}
                    @endif
                </td>
            </tr>         
            <tr>
                <td>Alamat</td>
                <td style="text-align: center;">:</td>
                <td>{{ toUppercase($item[3003961] ?? '') }}</td>
            </tr>
        </table>

        {{-- Ditemukan / Tidak ditemukan --}}
        <table cellspacing="0" cellpadding="0" width="100%" style="text-align: justify; margin-top: 1em; border-collapse: collapse;">
            <tr>
                <td>
                    Dengan Hasil Pemeriksaan Kesehatan Jiwa pada saat ini: 
                    @if (isset($item[3003953]) && $item[3003953]) 
                        <b>DITEMUKAN</b> 
                    @else 
                        <s>DITEMUKAN</s> 
                    @endif
                    /
                    @if (isset($item[3003954]) && $item[3003954]) 
                        <b>TIDAK DITEMUKAN</b> 
                    @else 
                        <s>TIDAK DITEMUKAN</s> 
                    @endif 
                    TANDA DAN GEJALA GANGGUAN JIWA BERMAKNA YANG DAPAT MENGGANGGU AKTIVITAS KEHIDUPAN SEHARI-HARI.
                </td>
            </tr>
            <tr>
                <td style="padding-top: 1em;">
                    Demikian Surat Keterangan Pemeriksaan Kesehatan Jiwa ini dibuat dengan sebenarnya untuk keperluan: {{ $item[3003955] ?? '' }}.
                </td>
            </tr>
            <tr>
                <td>
                    Dan tidak dapat digunakan untuk kepentingan hukum lainnya.
                </td>
            </tr>
        </table>

        <table style="margin-top: 3em; width: 40%; margin-left:auto;">
            <tr>
                <td style="text-align: center;">Dokter yang memeriksa</td>
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
                <td style="text-align: center;">{{ $item[3003956] ? $item[3003956] : '' }}</td>
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