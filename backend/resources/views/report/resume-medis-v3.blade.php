<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Pulang</title>
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
        /* Padding for the header on the first page */
        @page :first {
            margin: 10mm;
        }

        /* Padding for the header on subsequent pages */
        @page {
            margin: 10mm;
            margin: 10mm;

        }
        .footer {
            text-align: center;
            position: fixed;
            bottom: 0;
            }

        
        
    </style>
</head>
<body>
    <section style="font-family:Arial;padding:5mm">
        <table cellspacing="0" cellpadding="0" border="1" width="100%">
            <tr>
                <td style="text-align: center" width="60%">
                    <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px;"><br>
                    <span style="font-size: 10pt;font-weight: bold;letter-spacing: normal;">{!! $res['profile']->baris1 !!}</span>
                    <br>
                    <span style="font-size: 12pt; font-weight: bold;letter-spacing: normal">{!! $res['profile']->baris2 !!}</span>
                    <br>
                    <span style="font-size: 10pt; font-weight: bold">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                    <br>
                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 120px;">
                    <br>
                    <span style="font-size: 7pt; font-weight: normal">Jl.  Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}, 895297 Faksimile : {{$res['profile']->faksimile}}
                    <br style="margin: 0px">
                    Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                    
                    </span>
                </td>
                <td width="40%">
                    <div class="box" style="text-align: left">
                        <table style="padding: 1px;">
                            <tr>
                                <td class="f-s-15 bold  text-top" style="width: 100px">No. RM</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold text-top"><b>{!! $res['d']['nocm']  !!}</b></td>
                            </tr>
                            <tr>
                                <td class="f-s-15 bold  text-top">Nama</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold  text-top"><b>{!!  $res['d']['namapasien']  !!}</b>
                                </td>
                            </tr>
                            <tr>
                                <td class="f-s-15 bold  text-top">Jenis Kelamin</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold  text-top">
                                    <b>{!!  $res['d']['jeniskelamin']   !!}</b></td>
                            </tr>
                            <tr>
                                <td class="f-s-15 bold  text-top">Tgl Lahir</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold  text-top">
                                    <b>{!! date('d-m-Y',strtotime( $res['d']['tgllahir']  )) !!}</b></td>
                            </tr>
                            <tr>
                                <td class="f-s-15 bold  text-top">Ruangan</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold  text-top"><b>{!! $res['d']['namaruangan']  !!}</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
            <tr>
                <th colspan="2">
                    RINGKASAN PULANG
                </th>
            </tr>
            <tr>
                <td colspan="2">
                    <table width="100%">
                        <tr width="100%">
                            <th>Tanggal Masuk</th>
                            <th>Tanggal Pulang</th>
                            <th>Wisma</th>
                            <th>Kelas</th>
                        </tr>
                        <tr width="100%">
                            <td>{!! $res['d']['tglmasuk'] !!}</td>
                            <td>{!! $res['d']['tglpulang']  != null?$res['d']['tglpulang'] :'-'!!}</td>
                            <td>{!! $res['d']['wisma'] !!}</td>
                            <td>{!! $res['d']['kelas'] !!}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table>
                        <tr>
                            <td style="font-weight:bold">Indikasi Dirawat : </td>
                            <td>{!! $res['d']['alasandirawat'] !!}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold">Diagnosa Masuk : </td>
                            <td style="white-space: pre-line;">{!! $res['d']['diagnosismasuk'] .', '.$res['d']['kddiagnosismasuk'][2] !!}</td>
                        </tr>
                    </table>
                </td>
                <td style="white-space: pre-line;">
                    <b>Hasil Pemeriksaan Fisik</b><br>
                    {!! $res['d']['hasilfisik'] !!}
                </td>
            </tr>
            <tr>
                <td colspan="2" style="white-space: pre-line;">
                    <b>Hasil Pemeriksaan Psikiatri</b><br>
                    {!! $res['d']['hasilpsikiatri'] !!}
                </td>
            </tr>
            
        </table>
    </section>
</body>
</html>