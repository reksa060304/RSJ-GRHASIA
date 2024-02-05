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
    <title>Pengkajian Awal Medis IGD Jiwa</title>
    <style>
        @page {
            size: A4;
            margin-top: 5mm;
        }

        @page: first {
            size: A4
        }
        @media print{
            table {page-break-after: auto}
            tr {page-break-inside: avoid;}
            td{page-break-inside: avoid;}
            thead{display: table-header-group;
            }
            tfoot{display:table-footer-group;}
        }

        .double-border {
            border: 4px solid #000;
        }

        .double-border:before {
            border: 4px solid #fff;
        }

        .box {
            border: 2px solid black;
            /border-radius: 6px;/
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
        .underline {
        text-decoration: underline;
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

        body {
            font-family: 'Arial'
        }

        td {
            vertical-align: top
        }

        input[type="checkbox"] {
            vertical-align: middle;
            transform: scale(0.7);
            /* Mengurangi skala kotak centang */
            margin-right: 0px;
        }

        label {
            vertical-align: middle;
            line-height: 1;
            /* Tambahan gaya CSS lainnya */
        }

        div {
            display: inline-block;
            /* atau sesuaikan dengan kebutuhan desain Anda */
            vertical-align: middle;
            /* atau sesuaikan dengan kebutuhan desain Anda */
        }

        td {
            margin: 0;
            padding: 3px;
           
            /* Juga pastikan padding disetel ke nol jika Anda ingin menghilangkan padding */
        }
      
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto" >
    <section style="font-family:Arial;padding:5mm 5mm 5mm 5mm;page-break-after: page;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td style="text-align: center;" width="15%">
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
                            <span style="font-size: 7pt; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon:
                                {!!$res['profile']->fixedphone!!}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                            </span>

                        </b>
                    </td>
                    {{-- @php 
                        @dd($res);
                        @endphp --}}
                    <td width="30%">
                        <div class="box" style="text-align: left">
                            <table style="padding: 1px;">
                                <tr>
                                    <td class="f-s-15  text-top" style="width: 40%">No. RM</td>
                                    <td class="f-s-15  text-top" style="width: 5%">:</td>
                                    <td class="f-s-15 text-top" style="width: 60%">{!! $res['d'][0]->nocm !!}</td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Nama</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top">{!! $res['d'][0]->namapasien !!}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Jenis Kelamin</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top">
                                        {!! $res['d'][0]->jeniskelamin !!}</td>
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
                    <th colspan="3">Pengkajian Awal Medis IGD Jiwa</th>

                </tr>


        </table>

        <table cellspacing="0" cellpadding="0" rules="none" width="100%" style="border: 1.5px solid #000;padding: 3px; ">

            <tr >
                <br>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> Mulai Pemeriksaan:
                    {{isset($item[310301]) ?$item[310301] : ""  }}
                   
                </td>

            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; text-align:left;padding-left:5px;font-weight:bold; ">ALLOANAMNESIS /
                    ANAMNESIS</td>
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;">A.Diperoleh dari : {{isset($item[310303]) ?$item[310303] : ""  }} ,
                    {{isset($item[310305]) ?$item[310305] : ""  }}</td>

                <td colspan="2" style="font-size: 8pt;">hubungan dengan penderita:
                    {{isset($item[310304]) ?$item[310304] : ""  }} , {{isset($item[310306]) ?$item[310306] : ""  }}</td>



            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">B.Riwayat Penyakit :
                    <br>
                    &nbsp;&nbsp; 1. Keluhan Utama / Keluhan Saat Ini : 
                    <font style="font-size: 12px;">{{isset($item[310307]) ?$item[310307] : ""  }}</font>
                    {{-- <br>
                    &nbsp;&nbsp;&nbsp;  {{isset($item[310307]) ?$item[310307] : ""  }}</td> --}}


            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 2. Sejak kapan terjadi perubahan tingkah laku / peningkatan gejala : {{isset($item[310308]) ?$item[310308] : ""  }}
                    {{-- <br>
                    &nbsp;&nbsp;&nbsp; {{isset($item[310308]) ?$item[310308] : ""  }}</td> --}}


            </tr>

            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 3. Gejala yang ditunjukkan: {{isset($item[310309]) ?$item[310309] : ""  }}
                    {{-- <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310309]) ?$item[310309] : ""  }} --}}



            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 4. Riwayat Gangguan Jiwa Sebelumnya :
                    <br>
                    &nbsp;&nbsp;<input type="checkbox" id="tidak pernah" name="Tidak Pernah" @if (isset($item[310311]))
                        checked @endif>
                    <label for="tidak pernah">Tidak Pernah</label> {{isset($item[310635]) ?$item[310635] : ""  }}
                    &nbsp;&nbsp;
                    <input type="checkbox" id="pernah" @if (isset($item[310310])) checked @endif>
                    <label for="pernah">Pernah</label>


            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; - Pertama kali (kapan) :
                    <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310312]) ?$item[310312] : ""  }}
                </td>
                <td colspan="2" style="font-size: 8pt;">
                    &nbsp;&nbsp; - Pernah Sembuh :
                    <br>
                    &nbsp;&nbsp;<input type="checkbox" id="pernah" name="Pernah" @if (isset($item[310315])) checked
                        @endif>
                    <label for="pernah"> Pernah</label>

                    <input type="checkbox" id="tidak pernah" @if (isset($item[310316])) checked @endif>
                    <label for="tidak pernah">Tidak Pernah</label>
                    {{isset($item[310636]) ?$item[310636] : ""  }}

                    <br>


            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; - Berapa kali :
                    <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310313]) ?$item[310313] : ""  }}
                </td>
                <td colspan="2" style="font-size: 8pt;">
                    &nbsp;&nbsp; - Berobat Jalan :
                    <br>
                    &nbsp;&nbsp;<input type="checkbox" id="teratur" name="teratur" @if (isset($item[310318])) checked
                        @endif>
                    <label for="teratur"> Teratur</label>

                    <input type="checkbox" id="tidak teratur" @if (isset($item[310319])) checked @endif>
                    <label for="tidak teratur">Tidak Teratur</label>

                    <input type="checkbox" id="tidak pernah" @if (isset($item[310320])) checked @endif>
                    <label for="tidak pernah">Tidak Pernah</label>
                </td>

            </tr>
            <tr>
                <td  style="font-size: 8pt;padding-left:5px;">
                    5. Riwayat penggunaan obat
                    <br>
                    &nbsp;&nbsp; - Obat yang rutin dikonsumsi : {{isset($item[310596]) ?$item[310596] : ""  }}
                    
                    {{-- <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310596]) ?$item[310596] : ""  }} --}}
                </td>
                <td colspan="2" style="font-size: 8pt;">
                    <br>
                    &nbsp;&nbsp; - Obat yang digunakan sekarang : {{isset($item[310597]) ?$item[310597] : ""  }}
                    {{-- <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310597]) ?$item[310597] : ""  }} --}}
                    

                </td>

            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    6. Faktor yang mendahului
                    <br>
                    &nbsp;&nbsp; - Organik :
                    <br>
                    &nbsp;&nbsp;<input type="checkbox" id="panas" name="panas" @if (isset($item[310328])) checked
                        @endif>
                    <label for="panas"> Panas</label>

                    <input type="checkbox" id="kejang" @if (isset($item[310326])) checked @endif>
                    <label for="kejang">Kejang</label>

                    <input type="checkbox" id="keracunan" @if (isset($item[310330])) checked @endif>
                    <label for="keracunan">Keracunan</label>

                    <input type="checkbox" id="radupaksa">
                    <label for="radupaksa">Radupaksa</label>

                    <input type="checkbox" id="herediter">
                    <label for="herediter">Herediter</label>
                    <br>
                    &nbsp;&nbsp; - Spiritual :
                    <br>
                    &nbsp;&nbsp;&nbsp; {{isset($item[310386]) ?$item[310386] : ""  }}
                    <br>
                    &nbsp;&nbsp; - Psikososial :
                    <br>
                    &nbsp;&nbsp;<input type="checkbox" id="ada" name="ada" @if (isset($item[310323])) checked @endif>
                    <label for="ada"> Ada</label>

                    <input type="checkbox" id="tidak ada" @if (isset($item[310321])) checked @endif>
                    <label for="tidak ada">Tidak ada</label>

                    <input type="checkbox" id="tidak jelas" @if (isset($item[310322])) checked @endif>
                    <label for="tidak jelas">Tidak Jelas</label>
                    <br>
                    &nbsp;&nbsp; - Ekonomi :
                    <br>
                    &nbsp;&nbsp; &nbsp;
                    <br>
                    &nbsp;&nbsp; - Lain - lain :
                    <br>
                    &nbsp;&nbsp; &nbsp;
                </td>



            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    7. Riwayat gangguan jiwa dalam keluarga
                    <br>

                    &nbsp;&nbsp;<input type="checkbox" id="ada" name="ada" @if (isset($item[310339])) checked @endif>
                    <label for="ada"> Ada, Hubungan Keluarga</label>

                    <input type="checkbox" id="tidak" @if (isset($item[310341])) checked @endif>
                    <label for="tidak">Tidak Ada</label>

                    <input type="checkbox" id="tidakadaket" @if (isset($item[310342])) checked @endif>
                    <label for="tidakadaket">Tidak Ada Keterangan</label>


                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    8. Silsilah Keluarga : {{isset($item[310343]) ?$item[310343] : ""  }}
                    {{-- <br>

                    &nbsp;&nbsp; &nbsp; {{isset($item[310343]) ?$item[310343] : ""  }} --}}


                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    9. Riwayat pribadi :
                    <br>
                    &nbsp;&nbsp; - Kepribadian sebelum sakit : {{isset($item[310338]) ?$item[310338] : ""  }}
                    {{-- <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310338]) ?$item[310338] : ""  }} --}}
                    <br>
                    &nbsp;&nbsp; - Pola asuh :
                    <br>

                    <input type="checkbox" id="otoriter" @if (isset($item[310365])) checked @endif>
                    <label for="otoriter">Otoriter</label>

                    <input type="checkbox" id="demokratis" @if (isset($item[310366])) checked @endif>
                    <label for="demokratis">Demokratis</label>

                    <input type="checkbox" id="dimanja" @if (isset($item[310367])) checked @endif>
                    <label for="dimanja">Dimanja</label>

                    <input type="checkbox" id="kurangdiperhatikan" @if (isset($item[310368])) checked @endif>
                    <label for="kurangdiperhatikan">Kurang diperhatikan</label>
                    <br>
                    &nbsp;&nbsp; - Pendidikan :
                    <br>
                    <input type="checkbox" id="sdlulus" @if (isset($item[310372])) checked @endif>
                    <label for="sdlulus">SD,Lulus</label>

                    <input type="checkbox" id="sdtidak" @if (isset($item[310373])) checked @endif>
                    <label for="sdtidak">SD, Tidak</label>

                    <input type="checkbox" id="sltplulus" @if (isset($item[310374])) checked @endif>
                    <label for="sltplulus">SLTP,Lulus</label>

                    <input type="checkbox" id="sltptidak" @if (isset($item[310375])) checked @endif>
                    <label for="sltptidak">SLTP,Tidak</label>

                    <input type="checkbox" id="sltalulus" @if (isset($item[310376])) checked @endif>
                    <label for="sltalulus">SLTA,Lulus</label>

                    <input type="checkbox" id="sltatidak" @if (isset($item[310377])) checked @endif>
                    <label for="sltatidak">SLTA,Tidak</label>
                    <br>
                    <input type="checkbox" id="ptlulus" @if (isset($item[310378])) checked
                        @endif>
                    <label for="ptlulus">Perguruan Tinggi,Lulus</label>

                    <input type="checkbox" id="pttidak" @if (isset($item[310379])) checked @endif>
                    <label for="pttidak">Perguruan Tinggi,Tidak</label>

                    <br>
                    &nbsp;&nbsp; - Pekerjaan : {{isset($item[310385]) ?$item[310385] : ""  }} 
                    {{-- <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310385]) ?$item[310385] : ""  }} --}}
                    <br>
                    &nbsp;&nbsp; - Perkawinan : {{isset($item[310385]) ?$item[310391] : ""  }}
                    {{-- <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310385]) ?$item[310391] : ""  }} --}}
                </td>



            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    10. Riwayat penyalahgunaan NAPZA : {{isset($item[310621]) ?$item[310621] : ""  }}
                    {{-- <br>

                    &nbsp;&nbsp; &nbsp; {{isset($item[310621]) ?$item[310621] : ""  }} --}}


                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    11. Riwayat alergi : {{isset($item[310337]) ?$item[310337] : ""  }}
                    {{-- <br>

                    &nbsp;&nbsp;&nbsp; {{isset($item[310337]) ?$item[310337] : ""  }} --}}


                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; text-align:left;padding-left:5px; font-weight:bold;  ">PEMERIKSAAN FISIK
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    A. Vital Sign
                    <br>
                    &nbsp;&nbsp; Tekanan Darah : {{isset($item[310413]) ?$item[310413] : ""  }} mmHg
                    &nbsp;&nbsp; Nadi : {{isset($item[310414]) ?$item[310414] : ""  }} x/menit
                    &nbsp;&nbsp; Suhu : {{isset($item[310415]) ?$item[310415] : ""  }} oC
                    &nbsp;&nbsp; Respirasi : {{isset($item[310416]) ?$item[310416] : ""  }} x/menit
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    B. Status Generalis dan Neurologis
                    <br>
                    &nbsp;&nbsp; {{isset($item[310417]) ?$item[310417] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; text-align:left;padding-left:5px; font-weight:bold; ">PEMERIKSAAN
                    PSIKIATRIK</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">2.Riwayat Penyakit :
                    <br>
                    &nbsp;&nbsp; 1. Kesan umum : {{isset($item[310418]) ?$item[310418] : ""  }}
                    {{-- <br>
                    &nbsp;&nbsp; &nbsp; {{isset($item[310418]) ?$item[310418] : ""  }}</td> --}}


            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 2. Kesadaran :
                    <br>
                    &nbsp;&nbsp; <input type="checkbox" id="kuantitatif">
                    <label for="kuantitatif">Kuantitatif</label>

                    <input type="checkbox" id="kualitatif">
                    <label for="kualitatif">Kualitatif</label>


            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 3. Orientasi :
                    <br>
                    &nbsp;&nbsp; Waktu : {{isset($item[310433]) ?$item[310433] : ""  }}
                    &nbsp;&nbsp; Tempat : {{isset($item[310432]) ?$item[310432] : ""  }}
                    &nbsp;&nbsp; Orang : {{isset($item[310431]) ?$item[310431] : ""  }}
                    &nbsp;&nbsp; Situasi : {{isset($item[310434]) ?$item[310434] : ""  }}
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 4. Sikap dan tingkah laku :
                    <br>
                    <input type="checkbox" id="normal" @if (isset($item[310435])) checked @endif>
                    <label for="normal">Dalam batas normal</label>

                    <input type="checkbox" id="hipoaktif" @if (isset($item[310436])) checked @endif>
                    <label for="hipoaktif">Hipoaktif</label>

                    <input type="checkbox" id="disaktif" @if (isset($item[310437])) checked @endif>
                    <label for="disaktif">Disaktif</label>

                    <input type="checkbox" id="hiperaktif" @if (isset($item[310449])) checked @endif>
                    <label for="hiperaktif">Hiperaktif</label>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp;5. Proses pikir :
                    <br>
                    <br>
                    &nbsp;&nbsp; a. Bentuk pikir :
                    <br>
                    <input type="checkbox" id="realistis" @if (isset($item[310455])) checked @endif>
                    <label for="realistis">Realistis</label>

                    <input type="checkbox" id="nonrealistis" @if (isset($item[310456])) checked @endif>
                    <label for="nonrealistis">Non realistis</label>

                    <input type="checkbox" id="dereistrik" @if (isset($item[310457])) checked @endif>
                    <label for="dereistrik">Dereistrik</label>

                    <input type="checkbox" id="autistik" @if (isset($item[310458])) checked @endif>
                    <label for="autistik">Autistik</label>
                    <input type="checkbox" id="gangguan" @if (isset($item[310459])) checked @endif>
                    <label for="gangguan">Gangguan pikiran formal</label>

                    <input type="checkbox" id="kompulsif" @if (isset($item[310460])) checked @endif>
                    <label for="kompulsif">Kompulsif</label>
                    <br>
                    &nbsp;&nbsp; b. Isi pikir:
                    <br>
                    <input type="checkbox" id="tidakkelainan" @if (isset($item[310462])) checked @endif>
                    <label for="tidakkelainan">Tidak ada Kelainan</label>

                    <input type="checkbox" id="wahamsexual" @if (isset($item[310463])) checked @endif>
                    <label for="wahamsexual">Waham Sexual</label>

                    <input type="checkbox" id="sisippikir" @if (isset($item[310464])) checked @endif>
                    <label for="sisippikir">Waham sisip pikir</label>

                    <input type="checkbox" id="phobi" @if (isset($item[310465])) checked @endif>
                    <label for="phobi">Phobi</label>

                    <input type="checkbox" id="wahamkejar" @if (isset($item[310466])) checked @endif>
                    <label for="wahamkejar">Waham kejar</label>

                    <input type="checkbox" id="wahamberdosa" @if (isset($item[310467])) checked @endif>
                    <label for="wahamberdosa">Waham berdosa</label>

                    <input type="checkbox" id="wahamsedotpikir" @if (isset($item[310468])) checked @endif>
                    <label for="wahamsedotpikir">Waham sedot pikir</label>
                    <br>
                    <input type="checkbox" id="obsesi" @if (isset($item[310469])) checked @endif>
                    <label for="obsesi">obsesi</label>

                    <input type="checkbox" id="wahamdiancam" @if (isset($item[310470])) checked @endif>
                    <label for="wahamdiancam">Waham diancam</label>

                    <input type="checkbox" id="wahamrendahdiri" @if (isset($item[310471])) checked @endif>
                    <label for="wahamrendahdiri">waham rendah diri</label>

                    <input type="checkbox" id="wahamkendalipikir" @if (isset($item[310472])) checked @endif>
                    <label for="wahamkendalipikir">waham kendali pikir</label>

                    <input type="checkbox" id="idea" @if (isset($item[310473])) checked @endif>
                    <label for="idea">idea of reference</label>

                    <input type="checkbox" id="curiga" @if (isset($item[310474])) checked @endif>
                    <label for="curiga">Waham curiga</label>
                    <input type="checkbox" id="hipokondri" @if (isset($item[310475])) checked @endif>
                    <label for="hipokondri">waham hipokondri</label>
                    <br>
                    <input type="checkbox" id="siarpikir" @if (isset($item[310476])) checked @endif>
                    <label for="siarpikir">waham siar pikir</label>

                    <input type="checkbox" id="wahamcemburu" @if (isset($item[310477])) checked @endif>
                    <label for="wahamcemburu">Waham cemburu</label>

                    <input type="checkbox" id="wahamkebesaran" @if (isset($item[310478])) checked @endif>
                    <label for="wahamkebesaran">Waham kebesaran</label>

                    <input type="checkbox" id="wahammagikmistik" @if (isset($item[310479])) checked @endif>
                    <label for="wahammagikmistik">Waham magik mistik</label>
                    <label for="lain-lain">lain-lain: {{isset($item[310480]) ?$item[310480] : ""  }} </label>

                    <br>
                    &nbsp;&nbsp; c. Progresi pikir :
                    <br>
                    <br>
                    &nbsp;&nbsp;  - Kuantitatif:
                    <br>
                    <input type="checkbox" id="tdkadakelainan" @if (isset($item[310482])) checked @endif>
                    <label for="tdkadakelainan">Tidak ada kelainan</label>
                    <input type="checkbox" id="neologisme" @if (isset($item[310483])) checked @endif>
                    <label for="neologisme">Neologisme</label>
                    <input type="checkbox" id="sirkumstansial" @if (isset($item[310484])) checked @endif>
                    <label for="sirkumstansial">Sirkumstansial</label>
                    <input type="checkbox" id="gagap" @if (isset($item[310485])) checked @endif>
                    <label for="gagap">Gagap</label>
                    <input type="checkbox" id="perseverasi" @if (isset($item[310486])) checked @endif>
                    <label for="perseverasi">Perseverasi</label>
                    <input type="checkbox" id="inkoherensi" @if (isset($item[310487])) checked @endif>
                    <label for="inkoherensi">inkoherensi</label>
                    <input type="checkbox" id="tangensial" @if (isset($item[310488])) checked @endif>
                    <label for="tangensial">Tangensial</label>
                    <input type="checkbox" id="verbegerasi" @if (isset($item[310489])) checked @endif>
                    <label for="verbegerasi">Verbegerasi</label>
                    <br>
                    <input type="checkbox" id="asosiasi" @if (isset($item[310490])) checked @endif>
                    <label for="asosiasi">Asosiasi longgar</label>
                    <input type="checkbox" id="flight" @if (isset($item[310491])) checked @endif>
                    <label for="flight">Flight of ideas</label>
                    <input type="checkbox" id="ekolali" @if (isset($item[310492])) checked @endif>
                    <label for="ekolali">Ekolali</label>
                    <input type="checkbox" id="irelevansi" @if (isset($item[310493])) checked @endif>
                    <label for="irelevansi">Irelevansi</label>
                    <input type="checkbox" id="mysticsm" @if (isset($item[310494])) checked @endif>
                    <label for="mysticsm">Flight into mysticsm</label>
                    <label for="lain-lain">lain-lain: {{isset($item[310495]) ?$item[310495] : ""  }} </label>

                    <br>
                    &nbsp;&nbsp; - Kualitatif :
                    <br>
                    <input type="checkbox" id="tdkadakelainan" @if (isset($item[310497])) checked @endif>
                    <label for="tdkadakelainan">Tidak ada kelainan</label>
                    <input type="checkbox" id="logore" @if (isset($item[310498])) checked @endif>
                    <label for="logore">Logore</label>
                    <input type="checkbox" id="reming" @if (isset($item[310499])) checked @endif>
                    <label for="reming">Reming</label>
                    <input type="checkbox" id="bloking" @if (isset($item[310500])) checked @endif>
                    <label for="bloking">Bloking</label>
                    <input type="checkbox" id="mutisme" @if (isset($item[310533])) checked @endif>
                    <label for="mutisme">Mutisme,</label>
                    <label for="lain-lain">lain-lain: {{isset($item[310534]) ?$item[310534] : ""  }} </label>

                </td>





            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 6. Mood :
                    <br>
                    <input type="checkbox" id="tdkadakelainan" @if (isset($item[310501])) checked @endif>
                    <label for="tdkadakelainan">Tidak ada kelainan</label>

                    <input type="checkbox" id="sedih" @if (isset($item[310502])) checked @endif>
                    <label for="sedih">Sedih</label>

                    <input type="checkbox" id="marah" @if (isset($item[310503])) checked @endif>
                    <label for="marah">Marah</label>

                    <input type="checkbox" id="curiga" @if (isset($item[310504])) checked @endif>
                    <label for="curiga">Curiga</label>

                    <input type="checkbox" id="gembira" @if (isset($item[310505])) checked @endif>
                    <label for="gembira">Gembira,</label>

                    <label for="lain-lain">lain-lain: {{isset($item[310506]) ?$item[310506] : ""  }} </label>

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 7. Afek :
                    <br>
                    <input type="checkbox" id="tdkadakelainan" @if (isset($item[310507])) checked @endif>
                    <label for="tdkadakelainan">Tidak ada kelainan</label>

                    <input type="checkbox" id="euforia" @if (isset($item[310508])) checked @endif>
                    <label for="euforia">Euforia</label>

                    <input type="checkbox" id="takut" @if (isset($item[310509])) checked @endif>
                    <label for="takut">Takut</label>

                    <input type="checkbox" id="curiga" @if (isset($item[310510])) checked @endif>
                    <label for="curiga">Curiga</label>

                    <input type="checkbox" id="menyempit" @if (isset($item[310511])) checked @endif>
                    <label for="menyempit">Menyempit</label>

                    <input type="checkbox" id="elasi" @if (isset($item[310512])) checked @endif>
                    <label for="elasi">Elasi</label>
                    <input type="checkbox" id="susah" @if (isset($item[310513])) checked @endif>
                    <label for="susah">Susah</label>
                    <input type="checkbox" id="tumpul" @if (isset($item[310514])) checked @endif>
                    <label for="Tumpul">Tumpul</label>
                    <input type="checkbox" id="ekstase" @if (isset($item[310515])) checked @endif>
                    <label for="ekstase">Ekstase</label>
                    <input type="checkbox" id="inappropriate" @if (isset($item[310516])) checked @endif>
                    <label for="inappropriate">Inappropriate</label>
                    <input type="checkbox" id="datar" @if (isset($item[310517])) checked @endif>
                    <label for="datar">Datar</label>
                    <br>
                    <input type="checkbox" id="panik" @if (isset($item[310518])) checked @endif>
                    <label for="panik">Panik</label>
                    <input type="checkbox" id="labil" @if (isset($item[310519])) checked @endif>
                    <label for="labil">Labil</label>
                    <input type="checkbox" id="indifferent" @if (isset($item[310520])) checked @endif>
                    <label for="indifferent">indifferent</label>
                    <input type="checkbox" id="tension" @if (isset($item[310521])) checked @endif>
                    <label for="tension">Tension</label>
                    <input type="checkbox" id="cemas" @if (isset($item[310522])) checked @endif>
                    <label for="cemas">Cemas,</label>

                    <label for="lain-lain">lain-lain: {{isset($item[310523]) ?$item[310523] : ""  }} </label>

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp; 8. Gangguan persepsi :
                    <br>
                    <input type="checkbox" id="halusinasidengar" @if (isset($item[310524])) checked @endif>
                    <label for="halusinasidengar">Halusinasi dengar</label>

                    <input type="checkbox" id="halusinasipenglihatan" @if (isset($item[310525])) checked @endif>
                    <label for="halusinasipenglihatan">Halusinasi penglihatan"</label>

                    <input type="checkbox" id="halusinasiperaba" @if (isset($item[310526])) checked @endif>
                    <label for="halusinasiperaba">Halusinasi peraba</label>

                    <input type="checkbox" id="halusinasipengecap" @if (isset($item[310527])) checked @endif>
                    <label for="halusinasipengecap">Halusinasi pengecap</label>

                    <input type="checkbox" id="halusinasipembauan" @if (isset($item[310528])) checked @endif>
                    <label for="halusinasipembauan">Halusinasi pembauan</label>
                    <br>
                    <input type="checkbox" id="halusinasisexual" @if (isset($item[310529])) checked @endif>
                    <label for="halusinasisexual">Halusinasi sexual</label>
                    <input type="checkbox" id="ilusi" @if (isset($item[310530])) checked @endif>
                    <label for="ilusi">ilusi,</label>
                    <label for="lain-lain">lain-lain: {{isset($item[310532]) ?$item[310532] : ""  }} </label>

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp;9. Gangguan memori :
                    <br>
                    <input type="checkbox" id="ada" @if (isset($item[310298])) checked @endif>
                    <label for="ada">Ada</label>

                    <input type="checkbox" id="tidak" @if (isset($item[310537])) checked @endif>
                    <label for="tidak">Tidak ada</label>


                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp;10. Gangguan Intelegensi :
                    <br>
                    <input type="checkbox" id="ada" @if (isset($item[310299])) checked @endif>
                    <label for="ada">Ada</label>

                    <input type="checkbox" id="tidak" @if (isset($item[310538])) checked @endif>
                    <label for="tidak">Tidak ada</label>


                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp;11. Perhatian :
                    <br>
                    <input type="checkbox" id="sukarsukar" @if (isset($item[310541])) checked @endif>
                    <label for="sukarsukar">Sukar ditarik sukar dicantum</label>

                    <input type="checkbox" id="sukarmudah" @if (isset($item[310542])) checked @endif>
                    <label for="sukarmudah">Sukar ditarik mudah dicantum</label>
                    <input type="checkbox" id="mudahsukar" @if (isset($item[310543])) checked @endif>
                    <label for="mudahsukar">Mudah ditarik sukar dicantum</label>
                    <input type="checkbox" id="mudahmudah" @if (isset($item[310543])) checked @endif>
                    <label for="mudahmudah">mudah ditarik mudah dicantum</label>
                    <br>
                    &nbsp;&nbsp;<label for="hubunganjiwa">Hubungan jiwa : </label>
                    <input type="checkbox" id="sukar" @if (isset($item[310539])) checked @endif>
                    <label for="sukar">Sukar</label>

                    <input type="checkbox" id="mudah" @if (isset($item[310540])) checked @endif>
                    <label for="mudah">Mudah</label>
                    

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    &nbsp;&nbsp;12. Insight :
                    <br>
                    <input type="checkbox" id="1" @if (isset($item[310546])) checked @endif>
                    <label for="1">1</label>

                    <input type="checkbox" id="2" @if (isset($item[310547])) checked @endif>
                    <label for="2">2</label>
                    <input type="checkbox" id="3" @if (isset($item[310548])) checked @endif>
                    <label for="3">3</label>
                    <input type="checkbox" id="4" @if (isset($item[310549])) checked @endif>
                    <label for="4">4</label>
                    <input type="checkbox" id="5" @if (isset($item[310550])) checked @endif>
                    <label for="5">5</label>
                    <input type="checkbox" id="6" @if (isset($item[310551])) checked @endif>
                    <label for="6">6</label>
                    <input type="checkbox" id="baik" @if (isset($item[310552])) checked @endif>
                    <label for="baik">Baik</label>
                    <input type="checkbox" id="jelek" @if (isset($item[310553])) checked @endif>
                    <label for="jelek">Jelek</label>
                    
                   
                    
                    

                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; text-align:left;padding-left:5px;font-weight:bold;  ">PEMERIKSAAN PENUNJANG</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                  
                    a. Laboratorium : {{isset($item[310554]) ?$item[310554] : ""  }} 
                    
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                     b. Radiologi :   {{isset($item[310555]) ?$item[310555] : ""  }} 
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    
                    c. EKG :  {{isset($item[310556]) ?$item[310556] : ""  }} 
                   
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    
                   
                     d. EEG : {{isset($item[310557]) ?$item[310557] : ""  }}
                   
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    e. Lain-lain:
                    <br>
                    <input type="checkbox" id="MMSE" @if (isset($item[310559])) checked @endif>
                    <label for="MMSE">MMSE : {{isset($item[310604]) ?$item[310604] : ""  }} </label>
                    <input type="checkbox" id="PANSS-EC" @if (isset($item[310560])) checked @endif>
                    <label for="PANSS-EC">PANSS-EC : {{isset($item[310605]) ?$item[310605] : ""  }}</label>
                    <input type="checkbox" id="HRSD" @if (isset($item[310561])) checked @endif>
                    <label for="PANSS-HRSD">HRSD : {{isset($item[310606]) ?$item[310606] : ""  }}</label>
                    <input type="checkbox" id="HRSA" @if (isset($item[310562])) checked @endif>
                    <label for="HRSA">HRSA : {{isset($item[310607]) ?$item[310607] : ""  }}</label>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; text-align:left;padding-left:5px; font-weight:bold; ">DIAGNOSIS</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    a. Axis I
                    <br>
                    &nbsp;&nbsp; {{isset($item[310563]) ?$item[310563] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    a. Axis I
                    <br>
                    &nbsp;&nbsp; {{isset($item[310563]) ?$item[310563] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    a. Axis I :
                    <br>
                    &nbsp;&nbsp; {{isset($item[310563]) ?$item[310563] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    b. Axis II :
                    <br>
                    &nbsp;&nbsp; {{isset($item[310564]) ?$item[310564] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    c. Axis III :
                    <br>
                    &nbsp;&nbsp; {{isset($item[310565]) ?$item[310565] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    d. Axis IV :
                    <br>
                    &nbsp;&nbsp; {{isset($item[310566]) ?$item[310566] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    e. Axis V GAF Scale :
                    <br>
                    &nbsp;&nbsp; {{isset($item[310567]) ?$item[310567] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; text-align:left;padding-left:5px; font-weight:bold; ">MASALAH KEPERAWATAN</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                
                    &nbsp;&nbsp; {{isset($item[310603]) ?$item[310603] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; text-align:left; padding-left:5px; font-weight:bold; ">PENATALAKSANAAN</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                   
                    &nbsp;&nbsp; {{isset($item[310568]) ?$item[310568] : ""  }}

                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;font-weight:bold;text-decoration:underline;padding-left:5px;">
                    <br>
                    <u>INTEGRASI ASUHAN</u>
                    
                    
                </td> 

            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <input type="checkbox" id="Dokter" @if (isset($item[310583])) checked @endif>
                    <label for="Dokter">Dokter : {{isset($item[12084]) ?$item[12084] : ""  }} </label>
                    <br>
                    <input type="checkbox" id="Perawat" @if (isset($item[310585])) checked @endif>
                    <label for="Perawat">Perawat : {{isset($item[12086]) ?$item[12086] : ""  }}</label>
                    <br>
                    <input type="checkbox" id="PPA lain" @if (isset($item[310587])) checked @endif>
                    <label for="PPA lain">PPA lain : {{isset($item[12088]) ?$item[12088] : ""  }}</label>
                </td>
            </tr>
            <tr>
                <td  style="font-size: 8pt;padding-left:5px;" colspan="3" >
                    Catatan / Notasi DPJP :
                    <br>
                    &nbsp;&nbsp;  {{isset($item[310589]) ?$item[310589] : ""  }}
                   


                </td>
                
            </tr>
            <tr>
                <td></td>
                <td colspan="2" style="font-size: 8pt;padding-left:5px;">
                   
                    Paraf DPJP :
                    <br>
                    &nbsp;&nbsp;  {{isset($item[310590]) ?$item[310590] : ""  }}


                </td>
            </tr>
            <tr>
                
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                   
                    Keadaan Waktu Keluar :
                    <br>
                    &nbsp;&nbsp; {{isset($item[310569]) ?$item[310569] : ""  }}


                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    Penjelasan hasil pengkajian, pemeriksaan fisik dan penunjang, diagnosis, rencana asuhan dan terapi, dijelaskan kepada :
                    <br>
                    <input type="checkbox" id="Pasien" @if (isset($item[310598])) checked @endif>
                    <label for="Pasien">Pasien</label>
                    <br>
                    <input type="checkbox" id="Keluargapasien" @if (isset($item[310599])) checked @endif>
                    <label for="Keluargapasien">Keluarga pasien,Nama : {{isset($item[310600]) ?$item[310600] : ""  }} </label>
                    
                   <label for="hubungan">Hubungan dengan Pasien :{{isset($item[310601]) ?$item[310601] : ""  }}</label> 
                    <br>
                    &nbsp;&nbsp;Lainnya :{{isset($item[310602]) ?$item[310602] : ""  }}
                    <br>
                    
                   
                    
                    

                </td>
            </tr>
            <tr>
                <td style="padding: 0px;" colspan="3">
                    <table cellspacing="0" cellpadding="0" width="100%" style="border-top: 1.5px solid #000">
                        <tr>
                            <td  style="font-size: 8pt;">
                                <u>RENCANA PEMULANGAN PASIEN</u>
                                <br>
                                <input type="checkbox" id="Pulang" @if (isset($item[310575])) checked @endif>
                                <label for="Pulang">Pulang</label>
            
                                <input type="checkbox" id="konsultasi" @if (isset($item[310576])) checked @endif>
                                <label for="konsultasi">Konsultasi Selesai</label>
                                <br>
                                <input type="checkbox" id="kontrol" @if (isset($item[310577])) checked @endif>
                                <label for="kontrol">Kontrol Ulang,hari: {{isset($item[310578]) ?$item[310578] : ""  }}</label>
                                <br>
                                <input type="checkbox" id="rujuk" @if (isset($item[310579])) checked @endif>
                                <label for="rujuk">Rujuk ke: {{isset($item[310580]) ?$item[310580] : ""  }}</label>
                                <br>
                                <input type="checkbox" id="ranap" @if (isset($item[310629])) checked @endif>
                                <label for="ranap">Rawat Inap ke Ruang : {{isset($item[310630]) ?$item[310630] : ""  }} ,</label>
                                <br>
                                <label for="lainnya">lainnya : {{isset($item[310618]) ?$item[310618] : ""  }}</label>
            
                            </td>
                            <td colspan="2" style="font-size: 8pt;border-left: 1.5px solid #000;">
            
                                
                                <table style="width:100%">
                                    <tr>
                                      <td colspan="2" style="text-align:left;">Selesai pemeriksaan, Tanggal :{{isset($item[310591]) ?$item[310591] : ""  }}</td>
                                     
                                    </tr>
                                    <tr>
                                      <td style="text-align:center;">Penanggung Jawab Pasien</td>
                                      <td style="text-align:center;">Dokter Pemeriksa/DPJP</td>
                                     
                                    </tr>
                                    <tr >
                                        <td style="height:60px"></td>
                                        <td style="height:60px"></td>
                                       
                                      </tr>
                                    <tr >
                                      <td style="text-align:center;">( {{isset($item[310594]) ?$item[310594] : ""  }} )</td>
                                      <td style="text-align:center;">( {{isset($item[310595]) ?$item[310595] : ""  }} )</td>
                                     
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

        </div>
        
    </section>

</body>

</html>