<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Resume Medis</title>
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.qr-code.js') }}"></script>
    <style>
        @page {
            size: A4;
        }

        /*@media print {*/
        /*    body {margin:0}*/
        /*}*/
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

    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto">
    <table style="margin: auto" class="sheet padding-10mm" style="font-family:Tahoma;height: auto">
        <thead>
        <tr>
            <th>
                <div class="header">

                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tbody>
                        <tr>
                            <td width="10%" style="padding: 5px">
                                <img src="{{ asset('img/logo_only.png') }}" alt="" style="width: 90px;">
                            </td>
                            <td style="text-align: left">
                                <b>
                                    <span style="font-size: 16px">{!! $res['profile']->namalengkap !!}</span></br>
                                    </br>
                                    <span style="font-size: 14px;">{!! $res['profile']->alamatlengkap !!}</span>
                                </b>
                            </td>
                            <td width="50%" style="padding: 10px">
                                <div class="box" style="text-align: left">
                                    <table style="padding: 3px;">
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

                    <hr style="border:2px solid #000;margin-bottom:0px">
                    <hr style="border:0.5px solid #000;margin-top:2px">
                    <table >
                        <tr>
                            <td style="width: 90%">
                                <table>
                                    <tr>
                                        <th style="font-size: 20px">RESUME MEDIS</th>
                                    </tr>
                                </table>
                            </td>
                            <td width="10%">
                                <table style="text-align: right">
                                    <tr>
                                        <th style="font-size: 20px">RAHASIA</th>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    </div>

            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>
                <div class="content">
                    <table>
                        <tr>
                            <table width="100%" border="1" bordercolor="#000000" class="garis6"
                                   style="margin-left: 2px">
                                <tr>
                                    <td colspan="2" width="33%">
                                        <span class="bold">Tanggal Masuk</span>
                                        <br>
                                        {!! $res['d']['tglregistrasi'] !!}
                                    </td>
                                    <td width="33%">
                                        <span class="bold">Tanggal Keluar/Meninggal</span>
                                        <br>
                                        {!! $res['d']['tglpulang']  != null?$res['d']['tglpulang'] :'-'!!}
                                    </td>
                                    <td width="33%">
                                        <span class="bold">Berat Lahir</span>
                                        <br>
                                        -
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <span class="bold">Penanggung Pembayaran</span>
                                        <br>
                                        <span class="text-top"> {!! $res['d']['kelompokpasien'] !!}</span>
                                    </td>
                                    <td colspan="2">
                                        <span class="bold">Diagnosis Masuk</span>
                                        <br>
                                        <span class="text-top">{!! $res['d']['diagnosismasuk'] .', '.$res['d']['kddiagnosismasuk'][2] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Ringkasan Riwayat Penyakit</span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>{!! $res['d']['ringkasanriwayatpenyakit']  !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Pemeriksaan Fisik</span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>{!! $res['d']['pemeriksaanfisik']  !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Pemeriksaan Penunjang / Diagnostik Terpenting</span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>-</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Alasan Rawat</span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>{!! $res['d']['alasandirawat'] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Terapi/Pengobatan Selama di Rumah Sakit</span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>{!! nl2br($res['d']['terapi']) !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Hasil Konsultasi</span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>{!! nl2br($res['d']['hasilkonsultasi']) !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Diagnosis </span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span class="text-top">{!! $res['d']['diagnosisawal'] .', '.$res['d']['kddiagnosisawal'][2] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Diagnosis  Sekunder</span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>{!! $res['d']['kddiagnosistambahan'] != null ? $res['d']['kddiagnosistambahan'][2] : '-'!!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Tindakan Prosedur </span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>{!! $res['d']['tindakanprosedur'] !!}</span>
                                    </td>
                                </tr>
                                {{--                <tr>--}}
                                {{--                    <td class="top-height">--}}
                                {{--                        <span class="bold">Alergi/ Reaksi Obat </span>--}}
                                {{--                    </td>--}}
                                {{--                    <td colspan="3" class="text-top">--}}
                                {{--                        <span>{!! $res['d']['tindakanprosedur'] !!}</span>--}}
                                {{--                    </td>--}}
                                {{--                </tr>--}}
                                {{--                <tr>--}}
                                {{--                    <td class="top-height">--}}
                                {{--                        <span class="bold">Hasil Laboratorium  belum selesai/pending </span>--}}
                                {{--                    </td>--}}
                                {{--                    <td colspan="3" class="text-top">--}}
                                {{--                        <span></span>--}}
                                {{--                    </td>--}}
                                {{--                </tr>--}}
                                {{--                <tr>--}}
                                {{--                    <td class="top-height">--}}
                                {{--                        <span class="bold">Diet  </span>--}}
                                {{--                    </td>--}}
                                {{--                    <td colspan="3" class="text-top">--}}
                                {{--                        <span></span>--}}
                                {{--                    </td>--}}
                                {{--                </tr>--}}
                                {{--                <tr>--}}
                                {{--                    <td class="top-height">--}}
                                {{--                        <span class="bold">Kondisi Saat Pulang</span>--}}
                                {{--                    </td>--}}
                                {{--                    <td colspan="3" class="text-top">--}}
                                {{--                        <span>{!! $res['d']['kondisiwaktukeluar'] !!}</span>--}}
                                {{--                    </td>--}}
                                {{--                </tr>--}}
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">Tindak Lanjut/Anjuran/Edukasi </span>
                                    </td>
                                    <td colspan="3" class="text-top">
                                        <span>{!! nl2br( $res['d']['instruksianjuran']) !!}</span>
                                    </td>
                                </tr>


                                <tr>
                                    <td class="top-height" colspan="4">
                                        <span class="bold">Kondisi Saat Pulang :</span> {!! $res['d']['kondisiwaktukeluar'] !!}
                                        <span
                                                style="float: right;vertical-align: text-top">
                            <span class="bold">Tgl Kontrol :</span> {!! $res['d']['tglkontrolpoli'] == null ? '-' : $res['d']['tglkontrolpoli']  !!}</span>
                                        <br>
                                        <span class="bold">Pengobatan :</span> {!! $res['d']['pengobatandilanjutkan'] !!}
                                    </td>

                                </tr>
                                <tr>
                                    <td class="top-height" colspan="4">
                                        <span class="bold">Terapi Pulang </span>
                                        <table width="100%" style="padding: 0 5px 0 5px;text-align: left">
                                            <tr>
                                                <td><b>Nama Obat</b></td>
                                                <td><b>Jumlah </b></td>
                                                <td><b>Dosis</b></td>
                                                <td><b>Frekuensi</b></td>
                                                <td><b>Cara Pemberian</b></td>
                                            </tr>
                                            @foreach($res['d']['details'] as $items)
                                                <tr>

                                                    <td>{!! $items->namaobat !!}</td>
                                                    <td>{!! $items->jumlah !!}</td>
                                                    <td>{!! $items->dosis !!}</td>
                                                    <td>{!! $items->frekuensi !!}</td>
                                                    <td>{!! $items->carapemberian !!}</td>

                                                </tr>
                                            @endforeach
                                        </table>
                                    </td>

                                </tr>
                            </table>
                            <figure class="table">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td width="33%" style="text-align: center">
                                            <b>Pasien / Keluarga</b>
                                        </td>

                                        <td width="33%"></td>
                                        <td width="33%"><b>Bandung</b>, {!! date('d-m-Y') !!} <br>
                                            <b>Dokter Penanggung Jawab</b></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style="text-align: center" id="qrPasien"></div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div style="text-align: center" id="qrDokter"></div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="text-align: center"><span style="font-weight: bold;color: #ccc">Ditandatangani secara elektronik</span>
                                        </td>
                                        <td style="text-align: center">&nbsp;</td>
                                        <td style="text-align: center"><span style="font-weight: bold;color: #ccc">Ditandatangani secara elektronik</span>
                                            <br>{!! $res['d']['namadokter'] !!}
                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </figure>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</body>

<script type="text/javascript">
    var APP_URL = {!! json_encode(url('/')) !!}
    $(function () {
        'use strict';

        $('#qrPasien').qrcode({
            text: APP_URL + '/service/medifirst2000/report/cetak-pasien?reg=' + {{ $res['d']['noregistrasi'] }} ,
            height: 75,
            width: 75
        });
        $('#qrDokter').qrcode({
            text: APP_URL + '/service/medifirst2000/report/cetak-dokter?reg=' + {{ $res['d']['noregistrasi'] }} ,
            height: 75,
            width: 75
        });

    })
</script>
</body>

</html>
