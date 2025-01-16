<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Surat Pasien Melarikan Diri</title>
    {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
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
                                    <td style="width: 100px;font-size: 13px; font-weight: bold">CM.RJP.01.003/20 {{isset($item[3003990]) ? $item[3003990] : '' }} 
                                        <br><br><br> <br><br><br></td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr> --}}
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
        
        {{-- awalan --}}
        <table width="100%" style="margin-top: 2em" cellspacing="0" cellpadding="0">
            <tr>
                <th style="text-decoration: underline; font-size: 15px">
                    SURAT KETERANGAN PASIEN MELARIKAN DIRI
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
                <td style="font-weight: bold; width: 35%;">Nama</td>
                <td width="1%">:</td>
                <td>{{ $item[3003984] ? $item[3003984] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">Tanggal lahir</td>
                <td width="1%">:</td>
                <td>{{ $item[3011301] ? $item[3011301] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">No. RM</td>
                <td width="1%">:</td>
                <td>{{ $item[3011302 ] ? $item[3011302 ] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">Diagnosis medis</td>
                <td width="1%">:</td>
                <td>{{ $item[3011303] ? $item[3011303] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">Alamat</td>
                <td width="1%">:</td>
                <td>{{ $item[3011304] ? $item[3011304] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">Ruangan/Wisma</td>
                <td width="1%">:</td>
                <td>{{ $item[3011305] ? $item[3011305] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">Telah melarikan diri dari RSJ Grhasia pada tanggal,jam</td>
                <td width="1%">:</td>
                <td>{{ $item[3011306] ? $item[3011306] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">Dengan keadaan sebelum lari</td>
                <td width="1%">:</td>
                <td>{{ $item[3011307] ? $item[3011307] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">Diagnosis keperawatan</td>
                <td width="1%">:</td>
                <td>{{ $item[3011308] ? $item[3011308] : null }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; width: 35%;">Tindakan yang telah dilakukan setelah pasien lari</td>
                <td width="1%">:</td>
                <td>{{ $item[3011309] ? $item[3011309] : null }}</td>
            </tr>
        </table>

        {{-- mengetahui --}}
        <table style="width: 100%; margin-left: 4em; margin-top: 1em;">
            <tr>
                <td>Mengetahui Kepala Ruangan / Duty Manager</td>
                <td>Yogyakarta, {{ $item[3011311] ? $item[3011311] : null }}</td>
            </tr>
            <tr>
                <td style="padding-top: 3em; padding-bottom: 3em;"></td>
            </tr>
            <tr>
                <td>{{ $item[3011310] ? $item[3011310] : null }}</td>
            </tr>
        </table>

        {{-- Perawat ruangan --}}
        <table style="width: 100%; text-align:center;">
            <tr>
                <td style="width: 50%"></td>
                <td style="padding-top: 1em;">Perawat</td>
            </tr>
            <tr>
                <td style="width: 50%"></td>
                <td style="padding-top: .5em;">{{ isset($item[3011312]) ? $item[3011312] : null }}</td>
            </tr>
            <tr>
                <td style="width: 50%"></td>
                <td style="padding-top: 1em;">Perawat</td>
            </tr>
            <tr>
                <td style="width: 50%"></td>
                <td style="padding-top: .5em;">{{ isset($item[3011313]) ? $item[3011313] : null }}</td>
            </tr>
            <tr>
                <td style="width: 50%"></td>
                <td style="padding-top: 1em;">Perawat</td>
            </tr>
            <tr>
                <td style="width: 50%"></td>
                <td style="padding-top: .5em;">{{ isset($item[3011314]) ? $item[3011314] : null }}</td>
            </tr>
        </table>

        {{-- dokter jaga --}}
        <table style="width: 100%; margin: 0 auto; text-align:center; margin-top: 1em;">
            <tr>
                <td>Mengetahui Dokter Ruangan / Dokter Jaga</td>
            </tr>
            @if ($tte == 'true')
                <tr>
                    <td style="padding: 2em 0;">
                        <p style="text-align: center; color:grey;font-family: 'Times New Roman', Times, serif;font-size: 16px;">
                            Ditandatangani Secara 
                            <br>Elektronik
                        </p>
                    </td>
                </tr>
            @else
                <tr>
                    <td style="padding: 2.5em 0;">
                        
                    </td>
                </tr>
            @endif
            <tr>
                <td>{{ $item[3011315] ? $item[3011315] : null }}</td>
            </tr>

            {{-- jika ada nip tampilkan nip jika tidak tampilkan siip --}}
            <tr>
                <td style="text-align: center">
                    NIP/SIP :  
                    @if (isset($peg->nippns))
                        {{ $peg->nippns }} {{ (isset($sip->nosip)) ? ' / '.$sip->nosip : '' }}
                    @else
                        {{ (isset($sip->nosip)) ? $sip->nosip : '' }}
                    @endif
                </td>
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