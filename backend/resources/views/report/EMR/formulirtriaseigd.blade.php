<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">
    <title>Formulir Triase IGD</title>
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
            bottom: 35%;
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
        body{
            font-family: 'Arial'
        }
        td {
            vertical-align: top
        }
        input[type="checkbox"] {
        vertical-align: middle;
        }

        label {
        vertical-align: middle;
        }
        div {
            display: inline-block; /* atau sesuaikan dengan kebutuhan desain Anda */
            vertical-align: middle; /* atau sesuaikan dengan kebutuhan desain Anda */
        }
    </style>
</head>
<body>
    <section style="font-family:Arial;padding:15mm 5mm 5mm 5mm">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td  style="text-align: center;" width="15%" >
                        <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 80px; margin: 0 !important;
                        padding: 0 !important;">
                        <br>
                        <span style="font-size: 10px; font-weight: bold">RS JIWA GRHASIA</span>
                        <br>
                        <span style="font-size: 7px; font-weight: bold">Daerah Istimewa Yogyakarta</span>
                    </td>
                    <td style="text-align: center;" width="50%">
                        <b>
                            <span style="font-size: 10pt;">{!! $res['profile']->baris1 !!}</span>
                            <br>
                            <span style="font-size: 12pt;">{!! $res['profile']->baris2 !!}</span>
                            <br>
                            <span style="font-size: 12pt;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                            <br>
                            <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 160px;">
                            <br>
                            <span style="font-size: 8pt; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}
                            <br style="margin: 0px">
                            Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                            </span>
    
                        </b>
                    </td>
                    <td width="30%">
                        <div class="box" style="text-align: left">
                            <table style="padding: 1px;">
                                <tr>
                                    <td class="f-s-15  text-top" style="width: 40%">No. RM</td>
                                    <td class="f-s-15  text-top"style="width: 5%">:</td>
                                    <td class="f-s-15 text-top" style="width: 60%">{!! $res['d'][0]->nocm  !!}</td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Nama</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top">{!!  $res['d'][0]->namapasien  !!}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Jenis Kelamin</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top">
                                        {!!  $res['d'][0]->jeniskelamin   !!}</td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Tgl Lahir</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top">
                                        {!! date('d-m-Y',strtotime( $res['d'][0]->tgllahir  )) !!}</td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <table  cellspacing="0" cellpadding="0" border="1" width="100%" style="border: 3px solid #000">
                            <tr >
                                <th  colspan="7" style="background-color: #B2A5E2;">FORMULIR TRIASE IGD</th>
                            </tr>
                            <tr>
                                <td colspan="3">Tanggal Masuk IGD :
                                    <br>
                                    {{isset($item[9085]) ?$item[9085] : ""  }}
                                </td>
                                <td colspan="3">Pukul :
                                    <br>
                                    {{isset($item["9085time"]) ?$item["9085time"] : ""  }}

                                </td>
                                <td rowspan="2" width="10%" style="background-color: #B2A5E2;">
                                    <div class="checkbox">
                                        <input type="checkbox" id="DOA" @if (isset($item[30006274])) checked @endif> <label for="DOA" style="font-weight: bold">DOA</label>
                                    </div> <br>
                                    Tanda Kehidupan ( - ) <br>
                                    Tidak ada denyut nadi <br>
                                    EKG Flat <br>
                                    Jam DOA</td>
                            </tr>
                            
                            <tr>
                                <td colspan="6">
                                    <table width="100%">
                                        <tr>
                                            <td width="20%">Macam Kasus : </td>
                                            <td width="80%">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="_jiwa" name="JIWA" @if (isset($item[30006275])) checked @endif>
                                                    <label for="jiwa">JIWA</label>
                                                </div>
                                                {{-- <input type="checkbox" id="JIWA" @if (isset($item[30006275])) checked @endif><label for="JIWA" style="padding-bottom: 100px">JIWA</label> --}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <div class="checkbox">
                                                    <input type="checkbox" id="NON JIWA" @if (isset($item[30006276])) checked @endif><label for="NON JIWA">NON JIWA</label>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7"> <br></td>
                            </tr>
                            <tr v-align="top">
                                <th width="15%">PEMERIKSAAN</th>
                                <th width="15%">1</th>
                                <th width="15%">2</th>
                                <th width="15%">TANDA VITAL</th>
                                <th width="15%">3</th>
                                <th width="15%">4</th>
                                <th width="15%">5</th>
                            </tr>
                            <tr>
                                <td rowspan="2"><i>AIRWAY</i></td>
                                <td rowspan="2" class="checkbox" style="background: red">
                                    <div class="checkbox">
                                        <input type="checkbox" id="_Sumbatan" name="Sumbatan" @if (isset($item[30006277])) checked @endif>
                                        <label for="Sumbatan" style="color: white">Sumbatan</label>
                                    </div>
                                </td>
                                <td rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Bebas" name="Bebas" @if (isset($item[30006278])) checked @endif>
                                        <label for="Bebas" >Bebas</label>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        Tekanan Darah <br> {{isset($item[30006279]) ? $item[30006279] : ''}} mmHg
                                    </div>
                                </td>
                                <td rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Bebas" name="Bebas" @if (isset($item[30006281])) checked @endif>
                                        <label for="Bebas" >Bebas</label>
                                    </div>
                                </td>
                                <td rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Bebas" name="Bebas" @if (isset($item[30006282])) checked @endif>
                                        <label for="Bebas" >Bebas</label>
                                    </div>
                                </td>
                                <td rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Bebas" name="Bebas" @if (isset($item[30006283])) checked @endif>
                                        <label for="Bebas" >Bebas</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Frekuensi Nadi <br> {{isset($item[30006280]) ? $item[30006280] : ''}} kali/menit
                                </td>
                            </tr>

                            <tr>
                                <td rowspan="3"><i>BREATHING</i></td>
                                <td class="checkbox" style="background: red">
                                    <div >
                                        <input type="checkbox" id="_Henti Napas" name="Henti Napas" @if (isset($item[30006284])) checked @endif>
                                        <label for="Henti Napas" style="color: white">Henti Napas</label>
                                    </div>
                                </td>
                                <td>
                                    <div class="checkbox">
                                        <input type="checkbox" id="FrekuensiNapas > 32 kali/mnt" name="FrekuensiNap> 32 kali/mnt" @if (isset($item[30006287])) checked @endif>
                                        <label for="FrekuensiNapa> 32 kali/mnt" >Frekuensi Napas > 32 kali/mnt</label>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        Frekuensi Napas <br> {{isset($item[30006289]) ? $item[30006289] : ''}} mmHg
                                    </div>
                                </td>
                                <td>
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Napas >=24-32kali/menit" name="Frekuensi Napas >=24-32kali/menit" @if (isset($item[30006292])) checked @endif>
                                        <label for="Frekuensi Napas >=24-32kali/menit">Frekuensi Napas >=24-32kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="3">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Napas >=20-24kali/menit" name="Frekuensi Napas >=20-24kali/menit" @if (isset($item[30006294])) checked @endif>
                                        <label for="Frekuensi Napas >=20-24kali/menit" >Frekuensi Napas >=20-24kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="3">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Napas >=16-20kali/menit" name="Frekuensi Napas >=16-20kali/menit" @if (isset($item[30006295])) checked @endif>
                                        <label for="Frekuensi Napas >=16-20kali/menit" >Frekuensi Napas >=16-20kali/menit</label>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td style="background: red">
                                    <div>
                                        <input type="checkbox" id="Frekuensi Napas >=10kali/menit" name="Frekuensi Napas >=10kali/menit" @if (isset($item[30006285])) checked @endif>
                                        <label for="Frekuensi Napas >=10kali/menit" style="color: white">Frekuensi Napas >=10kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="2">
                                    <div>
                                        <input type="checkbox" id="Mengis" name="Mengis" @if (isset($item[30006288])) checked @endif>
                                        <label for="Mengis">Mengi</label>
                                    </div>
                                </td>
                                <td>
                                    Suhu {{ isset($item[30006290]) ? $item[30006290]: ''}}oC
                                </td>
                                <td rowspan="2">
                                    <div>
                                        <input type="checkbox" id="Mengis" name="Mengis" @if (isset($item[30006293])) checked @endif>
                                        <label for="Mengis">Mengi</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: red">
                                    <div class="checkbox">
                                        <input type="checkbox" id="_Sianosis" name="Sianosis" @if (isset($item[30006286])) checked @endif>
                                        <label for="Sianosis" style="color: white">Sianosis</label>
                                    </div>
                                </td>
                                <td>
                                    SaO2 {{isset($item[30006291]) ? $item[30006291]: ''}} %
                                </td>
                            </tr>
                            <tr>
                                <td rowspan="4"><i>CIRCULATION</i></td>
                                <td style="background-color: red">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Henti Jantung" name="Henti Jantung" @if (isset($item[30006296])) checked @endif>
                                        <label for="Henti Jantung" style="color: white">Henti Jantung</label>
                                    </div>
                                </td>

                                <td>
                                    <div class="checkbox">
                                        <input type="checkbox" id="Nadi Teraba Lemah" name="Nadi Teraba Lemah" @if (isset($item[30006300])) checked @endif>
                                        <label for="Nadi Teraba Lemah">Nadi Teraba Lemah</label>
                                    </div>
                                </td>
                                <td>
                                    Riwayat Alergi
                                </td>
                                <td rowspan="4">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Nadi  120-150 kali/menit" name="Frekuensi Nadi  120-150 kali/menit" @if (isset($item[30006306])) checked @endif>
                                        <label for="Frekuensi Nadi  120-150 kali/menit">Frekuensi Nadi  120-150 kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="4">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Nadi  100-120 kali/menit" name="Frekuensi Nadi  100-120 kali/menit" @if (isset($item[30006307])) checked @endif>
                                        <label for="Frekuensi Nadi  100-120 kali/menit">Frekuensi Nadi  100-120 kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="4">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Nadi  60-100 kali/menit" name="Frekuensi Nadi  60-100 kali/menit" @if (isset($item[30006308])) checked @endif>
                                        <label for="Frekuensi Nadi  60-100 kali/menit">Frekuensi Nadi  60-100 kali/menit</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: red">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Nadi tak teraba" name="Nadi tak teraba" @if (isset($item[30006297])) checked @endif>
                                        <label for="Nadi tak teraba" style="color: white">Nadi tak teraba</label>
                                    </div>
                                </td>
                                <td rowspan="3">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Nadi <=59 atau >=150 kali/menit" name="Frekuensi Nadi <=59 atau >=150 kali/menit" @if (isset($item[30006301])) checked @endif>
                                        <label for="Frekuensi Nadi <=59 atau >=150 kali/menit">Frekuensi Nadi <=59 atau >=150 kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="3">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Makanan" name="Makanan" @if (isset($item[30006302])) checked @endif>
                                        <label for="Makanan">Makanan</label> <br>
                                        <input type="checkbox" id="Obat" name="Obat" @if (isset($item[30006303])) checked @endif>
                                        <label for="Obat">Obat</label> <br>
                                        Lain - lain {{isset($item[30006304])? $item[30006304] : ''}} <br>
                                        <input type="checkbox" id="Tidak Ada" name="Tidak Ada" @if (isset($item[30006305])) checked @endif>
                                        <label for="Tidak Ada">Tidak Ada</label> <br>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: red">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Akral Dingin" name="Akral Dingin" @if (isset($item[30006298])) checked @endif>
                                        <label for="Akral Dingin" style="color: white">Akral Dingin</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: red">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Pucat" name="Pucat" @if (isset($item[30006299])) checked @endif>
                                        <label for="Pucat" style="color: white">Pucat</label>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td rowspan="2">KESADARAN</td>
                                <td style="background-color: red" rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS < 9" name="GCS < 9" @if (isset($item[30006309])) checked @endif>
                                        <label for="GCS < 9" style="color: white">GCS < 9</label>
                                    </div>
                                </td>
                                <td rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS 9-12" name="GCS 9-12" @if (isset($item[30006310])) checked @endif>
                                        <label for="GCS 9-12" >GCS 9-12</label>
                                    </div>
                                </td>
                                <td>Riwayat Imunisasi</td>
                                <td rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS>12" name="GCS>12" @if (isset($item[30006313])) checked @endif>
                                        <label for="GCS>12" >GCS>12</label>
                                    </div>
                                </td>
                                <td rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS>13" name="GCS>13" @if (isset($item[30006314])) checked @endif>
                                        <label for="GCS>13" >GCS>13</label>
                                    </div>
                                </td>
                                <td rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS>15" name="GCS>15" @if (isset($item[30006315])) checked @endif>
                                        <label for="GCS>15" >GCS>15</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="checkbox">
                                        <input type="checkbox" id="Ya" name="Ya" @if (isset($item[30006316])) checked @endif>
                                        <label for="Ya">Ya</label> <br>
                                        <input type="checkbox" id="Tidak" name="Tidak" @if (isset($item[30006317])) checked @endif>
                                        <label for="Tidak">Tidak</label> <br>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
    
</body>
</html>