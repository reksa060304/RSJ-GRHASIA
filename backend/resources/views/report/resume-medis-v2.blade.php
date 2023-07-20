@extends('report.dom')
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>12.01 Ringkasan Pulang</title>
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
            margin-top: 5mm;
        }

        /* Padding for the header on subsequent pages */
        @page {
            margin-top: 5mm;
            margin-bottom: 5mm;

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
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 90px;">
                            {{-- @else --}}
                                {{-- <img src="service/img/logo_only.png" alt="" style="width: 90px;"> --}}
                            {{-- @endif --}}
                        </td>
                        <td width="60%" style="text-align: center">
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
                        <td width="40%" style="padding: 0px">
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
                </tbody>
            </table>
            <hr style="border:1px solid #000;">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <th colspan="4" style="font-size: 20px; text-align: center">RINGKASAN PULANG</th>
                </tr>
                <tr >
                    <td width="25%" style="padding-bottom: 10px">
                        <span class="bold">Tanggal Masuk</span>
                        <br>
                        {!! $res['d']['tglmasuk'] !!}
                    </td>
                    <td width="25%">
                        <span class="bold">Tanggal Pulang</span>
                        <br>
                        {!! $res['d']['tglpulang']  != null?$res['d']['tglpulang'] :'-'!!}
                    </td>
                    <td width="25%">
                        <span class="bold">Wisma</span>
                        <br>
                        {!! $res['d']['wisma'] !!}
                    </td>
                    <td width="25%">
                        <span class="bold">Kelas</span>
                        <br>
                        {!! $res['d']['kelas'] !!}
                    </td>
                </tr>
                <tr>
                    <td class="top-height" width="50px" colspan="4" style="padding-bottom: 10px">
                        <span class="bold">1. Indikasi Dirawat : </span>
                        <br>
                        <span style="white-space: pre-line;">{!! $res['d']['alasandirawat'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td class="top-height" colspan="4" style="padding-bottom: 10px">
                    <span class="bold">2. Diagnosa Masuk : </span>
                    <br>
                    <span style="white-space: pre-line;">{!! $res['d']['diagnosismasuk'] .', '.$res['d']['kddiagnosismasuk'][2] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td class="top-height" colspan="4" style="padding-bottom: 10px">
                    <span class="bold">3. Hasil Pemeriksaan Fisik : </span>
                    <br>
                    <span style="white-space: pre-line;">   {!! $res['d']['hasilfisik'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td class="top-height" colspan="4" style="padding-bottom: 10px">
                    <span class="bold">4. Hasil Pemeriksaan Psikiatri</span>
                    <br>
                    <span style="white-space: pre-line;">   {!! $res['d']['hasilpsikiatri'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td class="top-height" colspan="4" style="padding-bottom: 10px">
                        <span class="bold">5. Pemeriksaan Diagnostik / Penunjang</span>
                        <br>
                        <span style="white-space: pre-line;" class="text-top">   {!! $res['d']['hasilpenunjang'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                    <span class="bold">6. Terapi dan Tindakan yang diberikan </span>
                    </td>
                </tr>
                <tr>
                    <td class="top-height" colspan="4" style="padding-bottom: 10px">
                    <span class="bold">a. Selama Dirawat</span>
                    <br>
                    <span>{!! nl2br($res['d']['terapi']) !!}</span>
                    </td>
                </tr>
                <tr>
                    <td class="top-height" colspan="4" style="padding-bottom: 10px">
                    <span class="bold">b. Waktu Pulang</span>
                    <br>
                    <span> {!! $res['d']['terapipulang'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" width="25%" style="padding-bottom: 10px">
                    <span class="bold">7. Diagnosa Akhir </span>
                    </td>
                    <td colspan="2"  width="25%">
                    <span class="bold">Kode ICD</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" width="5%">
                        <span class="bold">Axis I &nbsp;  &nbsp;    :</span>
                        <span>{!! $res['d']['diagnosisawal'] !!}</span>
                    </td>
                    <td colspan="2" width="10%">
                        <span class="bold">1.</span>
                        <span>{!! $res['d']['kddiagnosisawal'][2] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" width="5%">
                        <span class="bold">Axis II &nbsp;  :</span>
                        <span>{!! $res['d']['axis2'] !!}</span>
                    </td>
                    <td colspan="2" width="10%">
                        <span class="bold">2.</span>
                        <span>{!! $res['d']['kddiagnosistambahan'][2] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" width="5%">
                        <span class="bold">Axis III  :</span>
                        <span>{!! $res['d']['axis3'] !!}</span>
                    </td>
                    <td colspan="2" width="10%">
                        <span class="bold">3.</span>
                        <span>{!! $res['d']['kddiagnosistambahan2'][2] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" width="5%">
                        <span class="bold">Axis IV &nbsp; :</span>
                        <span>{!! $res['d']['axis4'] !!}</span>
                    </td>
                    <td colspan="2" width="10%">
                        <span class="bold">4.</span>
                        <span>{!! $res['d']['kddiagnosistambahan3'][2] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" width="5%">
                        <span class="bold">Axis V &nbsp;  &nbsp;  :</span>
                        <span>{!! $res['d']['axis5'] !!}</span>
                    </td>
                    <td colspan="2" width="10%">
                        <span class="bold">5.</span>
                        <span>{!! $res['d']['kddiagnosistambahan4'][2] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="4" class="text-top" style="padding-bottom: 10px">
                        <span class="bold">8. Status / Kondisi Pasien Waktu Pulang :</span>
                        <br>
                        <span>{!! $res['d']['ringkasanriwayatpenyakit']  !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                    <span class="bold">9. Intruksi <i>Follow Up</i> / Tindak lanjut </span>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                    <span class="bold">a. Minum Obat Sesuai Aturan </span>
                    </td>
                </tr>
                <tr>
                    <td class="top-height2" colspan="4">
                    <span class="bold">b. Kontrol Klinik </span> 
                    <span > {!! $res['d']['kontrolklinik'] !!}</span>
                    <span class="bold">di RS Jiwa Grhasia / </span>
                    <span >   {!! $res['d']['rumahsakittujuan'] !!}</span>
                    <span class="bold">tanggal </span>
                    <span>   {!! $res['d']['tglkontrolpoli'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td class="top-height" colspan="4">
                        <span class="bold">c. Edukasi Perawatan Lanjut </span>
                        <span>{!! $res['d']['instruksianjuran'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan= "4" class="text-top">
                        <span class="bold">d. </span>
                        <span>{!! $res['d']['kondisiwaktukeluar'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan= "4" class="text-top">
                        <span class="bold">e. </span>
                        <span>{!! $res['d']['kondisiwaktukeluare'] !!}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        Saya telah menerima informasi tersebut dan menyetujui bahwa Ringkasan Pulang ini hanya digunakan untuk kepentingan pengobatan, serta TIDAK DAPAT digunakan untuk kepentingan lainnya.

                    </td>
                </tr>
            </table>
            
        </section>
        <div class="footer">
            <table  width="100%" style="font-family: Arial">
                <tr>
                    <td width="33%"></td>
                    <td width="33%"></td>
                    <td width="33%" style="text-align: center">
                        <b>Yogyakarta</b>, {!! date('d-m-Y') !!} 
                    </td>
                </tr>
            <tr>
                <td width="33%" style="text-align: center">
                    <b>Pasien / Wali Pasien</b>
                </td>
                <td width="33%"></td>
                <td width="33%" style="text-align: center">
                    <b>Dokter Penanggung Jawab Pasien</b></td>
            </tr>
            <tr>
                <td>
                    {{-- <div style="text-align: center" id="qrPasien"></div> --}}
                </td>
                <td></td>
                <td>
                    {{-- <div style="text-align: center" id="qrDokter"></div> --}}
                </td>
            </tr>

            <tr>
                <td style="text-align: center"><span style="font-weight: bold;color: #ccc">(__________________)</span>
                </td>
                <td style="text-align: center">&nbsp;</td>
                <td style="text-align: center"><span style="font-weight: bold;color: #ccc"></span>
                    <br><br> <br>{!! $res['d']['namadokter'] !!}
                </td>
            </tr>
        </table>
        </div>
    </body>
</html>

