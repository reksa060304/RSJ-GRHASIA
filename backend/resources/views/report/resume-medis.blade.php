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
            width: 25%;
        }
        .top-height2 {
            height: 30px;
            vertical-align: text-top;
            width: 18%;
        }

        .text-top {
            vertical-align: text-top;
        }

    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto">
    <table style="margin: auto" class="sheet padding-5mm" style="font-family:Tahoma;height: auto">
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
                
                    <table >
                        <tr>
                            <td style="width: 90%">
                                <table>
                                    <tr>
                                        <th style="font-size: 20px">RINGKASAN PULANG</th>
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
                            <table width="100%" border="0" bordercolor="#000000" 
                                   style="margin-left: 2px">
                                <tr>
                                    <td colspan="2" width="25%">
                                        <span class="bold">Tanggal Masuk</span>
                                        <br>
                                        {!! $res['d']['tglmasuk'] !!}
                                    </td>
                                    <td width="25%">
                                        <span class="bold">Tanggal Keluar/Meninggal</span>
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
                                    <td class="top-height">
                                        <span class="bold">1. Indikasi Dirawat</span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                        <span>{!! $res['d']['alasandirawat'] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                    <span class="bold">2. Diagnosa Masuk</span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                    <span class="text-top">{!! $res['d']['diagnosismasuk'] .', '.$res['d']['kddiagnosismasuk'][2] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                    <span class="bold">3. Hasil Pemeriksaan Fisik</span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                    <span class="text-top">   {!! $res['d']['hasilfisik'] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                    <span class="bold">4. Hasil Pemeriksaan Psikiatri</span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                    <span class="text-top">   {!! $res['d']['hasilpsikiatri'] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                    <span class="bold">5. Pemeriksaan Diagnostik / Penunjang</span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                    <span class="text-top">   {!! $res['d']['hasilpenunjang'] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">
                                    <span class="bold">6. Terapi dan Tindakan yang diberikan </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                    <span class="bold">a. Selama Dirawat</span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                    <span>{!! nl2br($res['d']['terapi']) !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                    <span class="bold">b. Waktu Pulang</span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                    <span> {!! $res['d']['terapipulang'] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" width="25%">
                                    <span class="bold">7. Diagnosa Akhir </span>
                                    </td>
                                    <td colspan="2"  width="25%">
                                    <span class="bold">Kode ICD</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" width="5%">
                                        <span class="bold">Axis I &nbsp;  &nbsp;    :</span>
                                        <span>{!! $res['d']['diagnosisawal'] !!}</span>
                                    </td>
                                    <td colspan="2" width="10%">
                                        <span class="bold">1.</span>
                                        <span>{!! $res['d']['kddiagnosisawal'][2] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" width="5%">
                                        <span class="bold">Axis II &nbsp;  :</span>
                                        <span>{!! $res['d']['axis2'] !!}</span>
                                    </td>
                                    <td colspan="2" width="10%">
                                        <span class="bold">2.</span>
                                        <span>{!! $res['d']['kddiagnosistambahan'][2] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" width="5%">
                                        <span class="bold">Axis III  :</span>
                                        <span>{!! $res['d']['axis3'] !!}</span>
                                    </td>
                                    <td colspan="2" width="10%">
                                        <span class="bold">3.</span>
                                        <span>{!! $res['d']['kddiagnosistambahan2'][2] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" width="5%">
                                        <span class="bold">Axis IV &nbsp; :</span>
                                        <span>{!! $res['d']['axis4'] !!}</span>
                                    </td>
                                    <td colspan="2" width="10%">
                                        <span class="bold">4.</span>
                                        <span>{!! $res['d']['kddiagnosistambahan3'][2] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" width="5%">
                                        <span class="bold">Axis V &nbsp;  &nbsp;  :</span>
                                        <span>{!! $res['d']['axis5'] !!}</span>
                                    </td>
                                    <td colspan="2" width="10%">
                                        <span class="bold">5.</span>
                                        <span>{!! $res['d']['kddiagnosistambahan4'][2] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">8. Status / Kondisi Pasien Waktu Pulang :</span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                        <span>{!! $res['d']['ringkasanriwayatpenyakit']  !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">
                                    <span class="bold">9. Intruksi <i>Follow Up</i> / Tindaklanjut </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">
                                    <span class="bold">a. Minum Obat Sesuai Aturan </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5">
                                        <table >
                                            <tr width="100%">
                                                <td class="top-height2">
                                                <span class="bold">b. Kontrol Klinik </span>
                                                </td>
                                                <td  class="text-top">
                                                <span > {!! $res['d']['kontrolklinik'] !!}</span>
                                                </td>
                                                <td  class="top-height2">
                                                <span class="bold">di RS Jiwa Grhasia / </span>
                                                </td>
                                                <td class="text-top">
                                                <span >   {!! $res['d']['rumahsakittujuan'] !!}</span>
                                                </td>
                                                <td class="top-height2">
                                                    <span class="bold">tanggal </span>
                                                </td>
                                                <td class="text-top">
                                                    <span>   {!! $res['d']['tglkontrolpoli'] !!}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                               
                                <tr>
                                    <td class="top-height">
                                        <span class="bold">c. Edukasi Perawatan Lanjut </span>
                                    </td>
                                    <td colspan="4" class="text-top">
                                        <span>{!! $res['d']['instruksianjuran'] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan= "5" class="text-top">
                                        <span class="bold">d. </span>
                                        <span>{!! $res['d']['kondisiwaktukeluar'] !!}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan= "5" class="text-top">
                                        <span class="bold">e. </span>
                                        <span>{!! $res['d']['kondisiwaktukeluare'] !!}</span>
                                    </td>
                                </tr>
                                
                                <!-- <tr>
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

                                </tr> -->
                            </table>
                            <label>Saya telah menerima informasi tersebut dan menyetujui bahwa Ringkasan Pulang ini hanya digunakan untuk kepentingan pengobatan, serta TIDAK DAPAT digunakan untuk kepentingan lainnya.</label>
                            <figure class="table">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td width="33%" style="text-align: center">
                                            <b>Pasien / Keluarga</b>
                                        </td>

                                        <td width="33%"></td>
                                        <td width="33%"><b>Sleman</b>, {!! date('d-m-Y') !!} <br>
                                            <b>Dokter Penanggung Jawab</b></td>
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
                                        <td style="text-align: center"><span style="font-weight: bold;color: #ccc"></span>
                                        </td>
                                        <td style="text-align: center">&nbsp;</td>
                                        <td style="text-align: center"><span style="font-weight: bold;color: #ccc"></span>
                                            <br><br> <br>{!! $res['d']['namadokter'] !!}
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
