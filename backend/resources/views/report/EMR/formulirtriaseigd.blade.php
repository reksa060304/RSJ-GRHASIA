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
            size:F4;
            margin-top: 5mm;
        }
        @page:first {
            size:F4
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
            /* left: 67%; */
            bottom: 0%;
            /* right: 3%; */
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
        transform: scale(0.7); /* Mengurangi skala kotak centang */
        margin-right: 0px;
        }
        label {
        vertical-align: middle;
        line-height: 1;
    /* Tambahan gaya CSS lainnya */
        }
        div {
            display: inline-block; /* atau sesuaikan dengan kebutuhan desain Anda */
            vertical-align: middle; /* atau sesuaikan dengan kebutuhan desain Anda */
        }
        
        td {
    margin: 0;
    padding: 0; /* Juga pastikan padding disetel ke nol jika Anda ingin menghilangkan padding */
}
    </style>
</head>
<body style="line-height: 1">
    <section style="font-family:Arial;padding:5mm 5mm 5mm 5mm;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td  style="text-align: center;" width="15%" >
                        <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin: 0 !important;
                        padding: 0 !important;">
                        <br>
                        <span style="font-size: 7pt; font-weight: bold">RS JIWA GRHASIA</span>
                        <br>
                        <span style="font-size: 8px; font-weight: bold">Daerah Istimewa Yogyakarta</span>
                    </td>
                    <td style="text-align: center;vertical-align: top" width="50%">
                        <b>
                            <span style="font-size: 9pt;">{!! $res['profile']->baris1 !!}</span>
                            <br>
                            <span style="font-size: 10pt;">{!! $res['profile']->baris2 !!}</span>
                            <br>
                            <span style="font-size: 10pt;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                            <br>
                            <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;">
                            <br>
                            <span style="font-size: 7pt; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}
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
                                        {!! date('d-m-Y',strtotime($res['d'][0]->tgllahir )) !!}</td>
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
                            <tr>
                                <th  colspan="7" style="background-color: #B2A5E2; padding:1px">FORMULIR TRIASE IGD</th>
                            </tr>
                            <tr>
                                <td colspan="3" style="font-size: 7pt" >Tanggal Masuk IGD :
                                    <br>
                                    {{isset($item[9085]) ?$item[9085] : ""  }}
                                </td>
                                <td colspan="2" style="font-size: 7pt">Pukul :
                                    <br>
                                    {{isset($item["9085time"]) ?$item["9085time"] : ""  }}

                                </td>
                                <td rowspan="2" colspan="2" width="10%" style="background-color: #B2A5E2;font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="DOA" @if (isset($item[30006274])) checked @endif> <label for="DOA"> 
                                            <b>DOA</b> <br>
                                            Tanda Kehidupan (-) Tidak ada denyut nadi
                                             <br>
                                            EKG Flat Jam DOA
                                            </label>
                                    </div> 
                                    </td>
                            </tr>
                            <tr>
                                <td colspan="5" style="font-size: 7pt">
                                    <table width="100%">
                                        <tr>
                                            <td width="15%" style="font-size: 7pt">Macam Kasus : </td>
                                            <td width="80%" style="font-size: 7pt">
                                                <input type="checkbox" id="_jiwa" name="JIWA" @if (isset($item[30006275])) checked @endif>
                                                    <label for="jiwa">JIWA</label>
                                                <input type="checkbox" id="NON JIWA" @if (isset($item[30006276])) checked @endif><label for="NON JIWA">NON JIWA</label>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7"> <br></td>
                            </tr>
                            <tr v-align="top">
                                <th width="10%"style="font-size: 7pt">PEMERIKSAAN</th>
                                <th width="15%"style="font-size: 7pt">1</th>
                                <th width="15%"style="font-size: 7pt">2</th>
                                <th width="10%"style="font-size: 7pt">TANDA VITAL</th>
                                <th width="15%"style="font-size: 7pt">3</th>
                                <th width="15%"style="font-size: 7pt">4</th>
                                <th width="15%"style="font-size: 7pt">5</th>
                            </tr>
                            <tr>
                                <td rowspan="2"style="font-size: 7pt;border-bottom: none;"><i>AIRWAY</i></td>
                                <td rowspan="2" class="checkbox" style="background: red;font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="_Sumbatan" name="Sumbatan" @if (isset($item[30006277])) checked @endif>
                                        <label for="Sumbatan" style="color: white;">Sumbatan</label>
                                    </div>
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Bebas" name="Bebas" @if (isset($item[30006278])) checked @endif>
                                        <label for="Bebas" >Bebas</label>
                                    </div>
                                </td>
                                <td style="font-size: 7pt" >
                                    <div>
                                        Tekanan Darah <br> {{isset($item[30006279]) ? $item[30006279] : ''}} mmHg
                                    </div>
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Bebas" name="Bebas" @if (isset($item[30006281])) checked @endif>
                                        <label for="Bebas" >Bebas</label>
                                    </div>
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Bebas" name="Bebas" @if (isset($item[30006282])) checked @endif>
                                        <label for="Bebas" >Bebas</label>
                                    </div>
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Bebas" name="Bebas" @if (isset($item[30006283])) checked @endif>
                                        <label for="Bebas" >Bebas</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 7pt">
                                    Frekuensi Nadi <br> {{isset($item[30006280]) ? $item[30006280] : ''}} kali/menit
                                </td>
                            </tr>

                            <tr>
                                <td rowspan="3" style="font-size: 7pt"><i>BREATHING</i></td>
                                <td class="checkbox" style="background: red;font-size: 7pt">
                                    <div >
                                        <input type="checkbox" id="_Henti Napas" name="Henti Napas" @if (isset($item[30006284])) checked @endif>
                                        <label for="Henti Napas" style="color: white">Henti Napas</label>
                                    </div>
                                </td>
                                <td style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="FrekuensiNapas > 32 kali/mnt" name="FrekuensiNap> 32 kali/mnt" @if (isset($item[30006287])) checked @endif>
                                        <label for="FrekuensiNapa> 32 kali/mnt" >Frekuensi Napas > 32 kali/mnt</label>
                                    </div>
                                </td>
                                <td style="font-size: 7pt">
                                    <div>
                                        Frekuensi Napas <br> {{isset($item[30006289]) ? $item[30006289] : ''}} mmHg
                                    </div>
                                </td>
                                <td style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Napas >=24-32kali/menit" name="Frekuensi Napas >=24-32kali/menit" @if (isset($item[30006292])) checked @endif>
                                        <label for="Frekuensi Napas >=24-32kali/menit">Frekuensi Napas >=24-32kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="3" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Napas >=20-24kali/menit" name="Frekuensi Napas >=20-24kali/menit" @if (isset($item[30006294])) checked @endif>
                                        <label for="Frekuensi Napas >=20-24kali/menit" >Frekuensi Napas >=20-24kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="3" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Napas >=16-20kali/menit" name="Frekuensi Napas >=16-20kali/menit" @if (isset($item[30006295])) checked @endif>
                                        <label for="Frekuensi Napas >=16-20kali/menit" >Frekuensi Napas >=16-20kali/menit</label>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td style="background: red;font-size: 7pt">
                                    <div>
                                        <input type="checkbox" id="Frekuensi Napas >=10kali/menit" name="Frekuensi Napas >=10kali/menit" @if (isset($item[30006285])) checked @endif>
                                        <label for="Frekuensi Napas >=10kali/menit" style="color: white">Frekuensi Napas >=10kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div>
                                        <input type="checkbox" id="Mengis" name="Mengis" @if (isset($item[30006288])) checked @endif>
                                        <label for="Mengis">Mengi</label>
                                    </div>
                                </td>
                                <td style="font-size: 7pt">
                                    Suhu {{ isset($item[30006290]) ? $item[30006290]: ''}}oC
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div>
                                        <input type="checkbox" id="Mengis" name="Mengis" @if (isset($item[30006293])) checked @endif>
                                        <label for="Mengis">Mengi</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: red;font-size: 7pt" >
                                    <div class="checkbox">
                                        <input type="checkbox" id="_Sianosis" name="Sianosis" @if (isset($item[30006286])) checked @endif>
                                        <label for="Sianosis" style="color: white">Sianosis</label>
                                    </div>
                                </td>
                                <td style="font-size: 7pt">
                                    SaO2 {{isset($item[30006291]) ? $item[30006291]: ''}} %
                                </td>
                            </tr>
                            <tr>
                                <td rowspan="4" style="font-size: 7pt"><i>CIRCULATION</i></td>
                                <td style="background-color: red;font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Henti Jantung" name="Henti Jantung" @if (isset($item[30006296])) checked @endif>
                                        <label for="Henti Jantung" style="color: white">Henti Jantung</label>
                                    </div>
                                </td>

                                <td style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Nadi Teraba Lemah" name="Nadi Teraba Lemah" @if (isset($item[30006300])) checked @endif>
                                        <label for="Nadi Teraba Lemah">Nadi Teraba Lemah</label>
                                    </div>
                                </td>
                                <td style="font-size: 7pt">
                                    Riwayat Alergi
                                </td>
                                <td rowspan="4" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Nadi  120-150 kali/menit" name="Frekuensi Nadi  120-150 kali/menit" @if (isset($item[30006306])) checked @endif>
                                        <label for="Frekuensi Nadi  120-150 kali/menit">Frekuensi Nadi  120-150 kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="4" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Nadi  100-120 kali/menit" name="Frekuensi Nadi  100-120 kali/menit" @if (isset($item[30006307])) checked @endif>
                                        <label for="Frekuensi Nadi  100-120 kali/menit">Frekuensi Nadi  100-120 kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="4" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Nadi  60-100 kali/menit" name="Frekuensi Nadi  60-100 kali/menit" @if (isset($item[30006308])) checked @endif>
                                        <label for="Frekuensi Nadi  60-100 kali/menit">Frekuensi Nadi  60-100 kali/menit</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: red;font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Nadi tak teraba" name="Nadi tak teraba" @if (isset($item[30006297])) checked @endif>
                                        <label for="Nadi tak teraba" style="color: white">Nadi tak teraba</label>
                                    </div>
                                </td>
                                <td rowspan="3" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Frekuensi Nadi <=59 atau >=150 kali/menit" name="Frekuensi Nadi <=59 atau >=150 kali/menit" @if (isset($item[30006301])) checked @endif>
                                        <label for="Frekuensi Nadi <=59 atau >=150 kali/menit">Frekuensi Nadi - 59 atau + 150 kali/menit</label>
                                    </div>
                                </td>
                                <td rowspan="3" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Makanan" name="Makanan" @if (isset($item[30006302])) checked @endif>
                                        <label for="Makanan">Makanan</label> <br>
                                        <input type="checkbox" id="Obat" name="Obat" @if (isset($item[30006303])) checked @endif>
                                        <label for="Obat">Obat</label> <br>
                                        <input type="checkbox" id="Makanan" name="Makanan" @if (isset($item[30006304])) checked @endif>
                                         {{isset($item[30006304])? $item[30006304] : '.............'}} <br>
                                        <input type="checkbox" id="Tidak Ada" name="Tidak Ada" @if (isset($item[30006305])) checked @endif>
                                        <label for="Tidak Ada">Tidak Ada</label> 
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: red;font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Akral Dingin" name="Akral Dingin" @if (isset($item[30006298])) checked @endif>
                                        <label for="Akral Dingin" style="color: white">Akral Dingin</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: red;font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Pucat" name="Pucat" @if (isset($item[30006299])) checked @endif>
                                        <label for="Pucat" style="color: white">Pucat</label>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td rowspan="2" style="font-size: 7pt">KESADARAN</td>
                                <td style="background-color: red;font-size: 7pt" rowspan="2">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS < 9" name="GCS < 9" @if (isset($item[30006309])) checked @endif>
                                        <label for="GCS < 9" style="color: white">GCS < 9</label>
                                    </div>
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS 9-12" name="GCS 9-12" @if (isset($item[30006310])) checked @endif>
                                        <label for="GCS 9-12" >GCS 9-12</label>
                                    </div>
                                </td>
                                <td style="font-size: 7pt">Imunisasi</td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS>12" name="GCS>12" @if (isset($item[30006313])) checked @endif>
                                        <label for="GCS>12" >GCS>12</label>
                                    </div>
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS>13" name="GCS>13" @if (isset($item[30006314])) checked @endif>
                                        <label for="GCS>13" >GCS>13</label>
                                    </div>
                                </td>
                                <td rowspan="2" style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="GCS>15" name="GCS>15" @if (isset($item[30006315])) checked @endif>
                                        <label for="GCS>15" >GCS>15</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 7pt">
                                    <div class="checkbox">
                                        <input type="checkbox" id="Ya" name="Ya" @if (isset($item[30006316])) checked @endif>
                                        <label for="Ya">Ya</label> 
                                        <input type="checkbox" id="Tidak" name="Tidak" @if (isset($item[30006317])) checked @endif>
                                        <label for="Tidak">Tidak</label>
                                    </div>
                                </td>
                            </tr>
                            
                        </table>
                        <table cellspacing="0" cellpadding="0" border="1" width="100%" style="border: 3px solid #000; ">
                            <tr>
                                <td colspan="7" style="font-size: 7pt"> 
                                    <b>KATEGORI PASIEN JIWA</b><br>
                                    <i>Apakah pasien punya keinginan / ide bunuh diri / ide pulang paksa ? Jika Ya pasien langsung masuk kategori <b>Krisis</b></i>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7" style="font-size: 7pt">
                                    <table cellspacing="0" cellpadding="0" border="1" width="100%" style="border: 1px solid">
                                        <tr>
                                            <td style="font-size: 7pt" colspan="2">Menciderai diri / orang lain</td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Tidak Ada" name="Tidak Ada" @if (isset($item[30006318])) checked @endif>
                                                    <label for="Tidak Ada">Tidak Ada</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Risiko kecil" name="Risiko kecil" @if (isset($item[30006319])) checked @endif>
                                                    <label for="Risiko kecil">Risiko kecil</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Risiko Besar" name="Risiko Besar" @if (isset($item[30006320])) checked @endif>
                                                    <label for="Risiko Besar">Risiko Besar</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Aktual" name="Aktual" @if (isset($item[30006321])) checked @endif>
                                                    <label for="Aktual">Aktual</label> 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt" colspan="2">Komunikasi</td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Ada Respon, Sesuai Lancar (0)" name="Ada Respon, Sesuai Lancar (0)" @if (isset($item[30006322])) checked @endif>
                                                    <label for="Ada Respon, Sesuai Lancar (0)">Ada Respon, Sesuai Lancar (0)</label> 
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Ada respon, sesuai tidak lancar (14)" name="Ada respon, sesuai tidak lancar (14)" @if (isset($item[30006323])) checked @endif>
                                                    <label for="Ada respon, sesuai tidak lancar (14)">Ada respon, sesuai tidak lancar (14)</label> 
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Ada respon, tidak sesuai (26)" name="Ada respon, tidak sesuai (26)" @if (isset($item[30006324])) checked @endif>
                                                    <label for="Ada respon, tidak sesuai (26)">Ada respon, tidak sesuai (26)</label> 
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Tidak ada respon (40)" name="Tidak ada respon (40)" @if (isset($item[30006325])) checked @endif>
                                                    <label for="Tidak ada respon (40)">Tidak ada respon (40)</label> 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt" colspan="2">Interaksi Sosial</td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Bersedia melakukan interaksi (0)" name="Bersedia melakukan interaksi (0)" @if (isset($item[30006326])) checked @endif>
                                                    <label for="Bersedia melakukan interaksi (0)">Bersedia melakukan interaksi (0)</label> 
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Bersedia interaksi dengan > 1 orang (5)" name="Bersedia interaksi dengan > 1 orang (5)" @if (isset($item[30006327])) checked @endif>
                                                    <label for="Bersedia interaksi dengan > 1 orang (5)">Bersedia interaksi dengan > 1 orang (5)</label> 
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Bersedia interaksi dengan 1 orang (10)" name="Bersedia interaksi dengan 1 orang (10)" @if (isset($item[30006328])) checked @endif>
                                                    <label for="Bersedia interaksi dengan 1 orang (10)">Bersedia interaksi dengan 1 orang (10)</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Tidak bersedia interaksi (15)" name="Tidak bersedia interaksi (15)" @if (isset($item[30006329])) checked @endif>
                                                    <label for="Tidak bersedia interaksi (15)">Tidak bersedia interaksi (15)</label> 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt" colspan="1" rowspan="3">Pemenuhan ADL </td>
                                            <td style="font-size: 7pt" width="5%"> Makan </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mandiri" name="Mandiri" @if (isset($item[30006330])) checked @endif>
                                                    <label for="Mandiri">Mandiri</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mandiri pengawasan (3)" name="Mandiri pengawasan (3)" @if (isset($item[30006333])) checked @endif>
                                                    <label for="Mandiri pengawasan (3)">Mandiri pengawasan (3)</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Dengan bantuan (7)" name="Dengan bantuan (7)" @if (isset($item[30006336])) checked @endif>
                                                    <label for="Dengan bantuan (7)">Dengan bantuan (7)</label> 
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006339])) checked @endif>
                                                    <label for="Menolak (10)">Menolak (10)</label> 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt"> Mandi </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mandiri" name="Mandiri" @if (isset($item[30006331])) checked @endif>
                                                    <label for="Mandiri">Mandiri</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mandiri pengawasan (3)" name="Mandiri pengawasan (3)" @if (isset($item[300034])) checked @endif>
                                                    <label for="Mandiri pengawasan (3)">Mandiri pengawasan (3)</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Dengan bantuan (7)" name="Dengan bantuan (7)" @if (isset($item[30006337])) checked @endif>
                                                    <label for="Dengan bantuan (7)">Dengan bantuan (7)</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006340])) checked @endif>
                                                    <label for="Menolak (10)">Menolak (10)</label> 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt"> Berpakaian </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mandiri" name="Mandiri" @if (isset($item[30006332])) checked @endif>
                                                    <label for="Mandiri">Mandiri</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mandiri pengawasan (3)" name="Mandiri pengawasan (3)" @if (isset($item[30006335])) checked @endif>
                                                    <label for="Mandiri pengawasan (3)">Mandiri pengawasan (3)</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Dengan bantuan (7)" name="Dengan bantuan (7)" @if (isset($item[30006337])) checked @endif>
                                                    <label for="Dengan bantuan (7)">Dengan bantuan (7)</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006341])) checked @endif>
                                                    <label for="Menolak (10)">Menolak (10)</label> 
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt" colspan="2">Tidur / Istirahat</td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Tenang (0)" name="Tenang (0)" @if (isset($item[30006342])) checked @endif>
                                                    <label for="Tenang (0)">Tenang (0)</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt; line-height: 1px">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Dapat tidur dengan intervensi keperawatan (3)" 
                                                    name="Dapat tidur dengan intervensi keperawatan (3)" @if (isset($item[30006343])) checked @endif>
                                                    <label for="Dapat tidur dengan intervensi keperawatan (3)">Dapat tidur dengan intervensi keperawatan (3)</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Tidak dapat tidur, intervensi farmakologi (7)" 
                                                    name="Tidak dapat tidur, intervensi farmakologi (7)" @if (isset($item[30006344])) checked @endif>
                                                    <label for="Tidak dapat tidur, intervensi farmakologi (7)">Tidak dapat tidur, intervensi farmakologi (7)</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Gangguan tidur berat (10)" name="Gangguan tidur berat (10)" @if (isset($item[30006345])) checked @endif>
                                                    <label for="Gangguan tidur berat (10)">Gangguan tidur berat (10)</label> <br>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt" colspan="2"> Pengobatan Oral / Injeksi</td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Aktif berpartisipasi (0)" name="Aktif berpartisipasi (0)" @if (isset($item[30006346])) checked @endif>
                                                    <label for="Aktif berpartisipasi (0)">Aktif berpartisipasi (0)</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Partisipasi dengan intervensi 1 - 1 (3)" 
                                                    name="Partisipasi dengan intervensi 1 - 1 (3)" @if (isset($item[30006347])) checked @endif>
                                                    <label for="Partisipasi dengan intervensi 1 - 1 (3)">Partisipasi dengan intervensi 1 - 1 (3)</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Bersedia dengan intervensi > 1 orang (7)" 
                                                    name="Bersedia dengan intervensi > 1 orang (7)" @if (isset($item[30006348])) checked @endif>
                                                    <label for="Bersedia dengan intervensi > 1 orang (7)">Bersedia dengan intervensi > 1 orang (7)</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006349])) checked @endif>
                                                    <label for="Menolak (10)">Menolak (10)</label>
                                                </div>
                                            </td>
                                        </tr>
            
                                        <tr>
                                            <td style="font-size: 7pt" colspan="1" rowspan="3">Aktivitas Terjadwal</td>
                                            <td style="font-size: 7pt"> Makan </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mengikuti jadwal (0) 1 kali pengarahan" name="Mengikuti jadwal (0) 1 kali pengarahan" @if (isset($item[30006350])) checked @endif>
                                                    <label for="Mengikuti jadwal (0) 1 kali pengarahan">Mengikuti jadwal (0) 1 kali pengarahan</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Perlu pengawasan (3) 1 kali pengarahan" name="Perlu pengawasan (3) 1 kali pengarahan" @if (isset($item[30006353])) checked @endif>
                                                    <label for="Perlu pengawasan (3) 1 kali pengarahan">Perlu pengawasan (3) 1 kali pengarahan</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id=">1x pengarahan (7) rentang waktu >" name=">1x pengarahan (7) rentang waktu >" @if (isset($item[30006356])) checked @endif>
                                                    <label for=">1x pengarahan (7) rentang waktu >">>1x pengarahan (7) rentang waktu ></label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006359])) checked @endif>
                                                    <label for="Menolak (10)">Menolak (10)</label> <br>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt"> Mandi </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mengikuti jadwal (0) 1 kali pengarahan" name="Mengikuti jadwal (0) 1 kali pengarahan" @if (isset($item[30006351])) checked @endif>
                                                    <label for="Mengikuti jadwal (0) 1 kali pengarahan">Mengikuti jadwal (0) 1 kali pengarahan</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Perlu pengawasan (3) 1 kali pengarahan" name="Perlu pengawasan (3) 1 kali pengarahan" @if (isset($item[30006354])) checked @endif>
                                                    <label for="Perlu pengawasan (3) 1 kali pengarahan">Perlu pengawasan (3) 1 kali pengarahan</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id=">1x pengarahan (7) rentang waktu >" name=">1x pengarahan (7) rentang waktu >" @if (isset($item[30006357])) checked @endif>
                                                    <label for=">1x pengarahan (7) rentang waktu >">>1x pengarahan (7) rentang waktu ></label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006360])) checked @endif>
                                                    <label for="Menolak (10)">Menolak (10)</label> <br>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 7pt"> Berpakaian </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Mengikuti jadwal (0) 1 kali pengarahan" name="Mengikuti jadwal (0) 1 kali pengarahan" @if (isset($item[30006352])) checked @endif>
                                                    <label for="Mengikuti jadwal (0) 1 kali pengarahan">Mengikuti jadwal (0) 1 kali pengarahan</label>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Perlu pengawasan (3) 1 kali pengarahan" name="Perlu pengawasan (3) 1 kali pengarahan" @if (isset($item[30006355])) checked @endif>
                                                    <label for="Perlu pengawasan (3) 1 kali pengarahan">Perlu pengawasan (3) 1 kali pengarahan</label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id=">1x pengarahan (7) rentang waktu >" name=">1x pengarahan (7) rentang waktu >" @if (isset($item[30006358])) checked @endif>
                                                    <label for=">1x pengarahan (7) rentang waktu >">>1x pengarahan (7) rentang waktu ></label> <br>
                                                </div>
                                            </td>
                                            <td style="font-size: 7pt">
                                                <div class="checkbox">
                                                    <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006361])) checked @endif>
                                                    <label for="Menolak (10)">Menolak (10)</label> <br>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="background-color: #B2A5E2;text-align: center;vertical-align: middle">
                                                <b>JUMLAH SKOR</b>
                                            </td>
                                            <td style="font-size: 7pt" colspan="4">
                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 0px solid">
                                                    <tr>
                                                        <td width="15%" style="text-align: center;vertical-align: middle;font-size: 10pt; border-left: #000">{{ isset($item[30006362])?$item[30006362] : '.......' }}</td>
                                                        <td style="font-size: 7pt">
                                                            <b>KATEGORI PASIEN</b>
                                                        </td>
                                                        <td style="font-size: 7pt">
                                                            <div class="checkbox">
                                                                <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006363])) checked @endif>
                                                                <label for="Menolak (10)"><b>Krisis</b><br>
                                                                    ( >= 120 )</label> 
                                                            </div>
                                                        </td>
                                                        <td style="font-size: 7pt">
                                                            <div class="checkbox">
                                                                <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006364])) checked @endif>
                                                                <label for="Menolak (10)"><b>Akut</b> <br>
                                                                    ( 60 - 119 )</label> 
                                                            </div>
                                                        </td>
                                                        <td style="font-size: 7pt">
                                                            <div class="checkbox">
                                                                <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006365])) checked @endif>
                                                                <label for="Menolak (10)"> 
                                                                    <b>Pemeliharaan</b><br>
                                                                    ( 31 - 59 ) </label> 
                                                            </div>
                                                        </td>
                                                        <td style="font-size: 7pt">
                                                            <div class="checkbox">
                                                                <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006366])) checked @endif>
                                                                <label for="Menolak (10)"> <b>Peningkatan</b><br>
                                                                    Kesehatan ( 0 - 30 )</label> 
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="6" style="vertical-align: middle">
                                                <table width="100%">
                                                    <tr>
                                                        <td>
                                                            <b>TINDAK LANJUT</b>
                                                        </td>
                                                        <td>
                                                            <div class="checkbox">
                                                                <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006367])) checked @endif>
                                                                <label for="Menolak (10)">Pulang</label> <br>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="checkbox">
                                                                <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006368])) checked @endif>
                                                                <label for="Menolak (10)">Ranap</label> <br>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="checkbox">
                                                                <input type="checkbox" id="Menolak (10)" name="Menolak (10)" @if (isset($item[30006369])) checked @endif>
                                                                <label for="Menolak (10)">Rujuk</label> <br>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                                        

                    </td>
                </tr>
            </tbody>
        </table>
        <div class="footer2">
            <table width="100%">
                <tbody style="text-align: center">
                    <tr>
                        <td width="33%" style="text-align: center"></td>
                        <td width="33%"></td>
                        <td width="33%">
                            Nama dan Tanda Tangan
                        </td>
                    </tr>
                    <tr>
                        <td width="33%" style="text-align: center"></td>
                        <td width="33%"></td>
                        <td width="33%">
                            Petugas Yang Memeriksa
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td height="60px"> </td>
                    </tr>
                    <tr>
                        <td style="text-align: center"></td>
                        <td style="text-align: center">&nbsp;</td>
                        <td width="33%">
                            {{isset($item[30006370]) ? $item[30006370]:''}}
                        </td>
                    </tr>
                  
                </tbody>
            </table>
        </div>
    </section>
    
</body>
</html>