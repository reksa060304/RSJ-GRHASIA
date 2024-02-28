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
    <title>PENGKAJIAN PASIEN / KLIEN FISIOTERAPI</title>
    <style>
        @page {
            size: A4;
            margin-top: 5mm;
        }

        @page: first {
            size: A4
        }

        @media print {
            table {
                page-break-after: auto
            }

            tr {
                page-break-inside: avoid;
            }

            td {
                page-break-inside: avoid;
            }

            thead {
                display: table-header-group;
            }

            tfoot {
                display: table-footer-group;
            }
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

<body class="A4" style="font-family:Tahoma;height: auto">
    <section style="font-family:Arial;padding:5mm 5mm 5mm 5mm;page-break-after: page;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td style="text-align: center;" width="15%">
                        <img src="img/logo_grhasia_com.png" alt="Logo"
                            style="width: 70px; margin: 0 !important;
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
                                {!! $res['profile']->fixedphone !!}
                                <br style="margin: 0px">
                                Laman: {!! $res['profile']->website !!}, Surel: {!! $res['profile']->alamatemail !!}
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
                                        {!! date('d-m-Y', strtotime($res['d'][0]->tgllahir)) !!}</td>
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
                    <th colspan="3">PENGKAJIAN PASIEN / KLIEN FISIOTERAPI</th>

                </tr>


        </table>

        <table cellspacing="0" cellpadding="0" rules="none" width="100%"
            style="border: 1px solid #000;padding: 3px; ">

            <tr>
                <br>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;border-bottom: 1px solid #000;"
                    colspan="3">
                    Mulai Pemeriksaan:
                    {{ isset($item[30006221]) ? $item[30006221] : '' }}


                </td>

            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
                    <font style="font-weight: bold; font-size: 10px;">A. Anamnese</font>

                </td>

            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3">
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        1. Keluhan Saat Ini :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                            $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 30006222 && !empty($item->value))
                                {!! $item->value !!}
                                @php
                                    $found = true;
                                @endphp
                            @break
                        @endif
                    @endforeach
                    @if (!$found)
                        ................
                    @endif
                </font>
            </td>

        </tr>
        <tr>
            <td style="font-size: 8pt;padding-left:5px;" colspan="3">
                &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                    2. Riwayat Penyakit Sekarang :
                </font>
                <br>
                &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                    @php
                        $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30006223 && !empty($item->value))
                            {!! $item->value !!}
                            @php
                                $found = true;
                            @endphp
                        @break
                    @endif
                @endforeach
                @if (!$found)
                    ................
                @endif
            </font>
        </td>

    </tr>
    <tr>
        <td style="font-size: 8pt;padding-left:5px;" colspan="3">
            &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                3. Riwayat Penyakit Dahulu dan Penyerta :
            </font>
            <br>
            &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                @php
                    $found = false;
                @endphp
                @foreach ($res['d'] as $item)
                    @if ($item->emrdfk == 30006224 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                            $found = true;
                        @endphp
                    @break
                @endif
            @endforeach
            @if (!$found)
                ................
            @endif
        </font>
    </td>

</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
        <font style="font-weight: bold; font-size: 10px;">B. Pemeriksaan Fisik</font>

    </td>

</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;" colspan="2">

        <table style="width:60%;border:1px solid black;">

          
            <tr>
                <td >
                    <font style="font-size: 9px; font-weight: 400;text-decoration:underline;">
                        Tanda Vital:
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        1. TD :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                            $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 30006225 && !empty($item->value))
                                {!! $item->value !!} mmHg
                                @php
                                    $found = true;
                                @endphp
                            @break
                        @endif
                    @endforeach
                    @if (!$found)
                        ................
                    @endif
                </font>
                <br>
                <font style="font-size: 9px; font-weight: 400;">
                    2. HR :
                </font>
                <font style="font-size: 9px; ">
                    @php
                        $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30006226 && !empty($item->value))
                            {!! $item->value !!} x/mnt
                            @php
                                $found = true;
                            @endphp
                        @break
                    @endif
                @endforeach
                @if (!$found)
                    ................
                @endif
            </font>
            <br>
            <font style="font-size: 9px; font-weight: 400;">
                3. Suhu :
            </font>
            <font style="font-size: 9px; ">
                @php
                    $found = false;
                @endphp
                @foreach ($res['d'] as $item)
                    @if ($item->emrdfk == 30006227 && !empty($item->value))
                        {!! $item->value !!} oC
                        @php
                            $found = true;
                        @endphp
                    @break
                @endif
            @endforeach
            @if (!$found)
                ................
            @endif
        </font>
        <br>
        <font style="font-size: 9px; font-weight: 400;">
            4. RR :
        </font>
        <font style="font-size: 9px; ">
            @php
                $found = false;
            @endphp
            @foreach ($res['d'] as $item)
                @if ($item->emrdfk == 30006228 && !empty($item->value))
                    {!! $item->value !!} x/mnt
                    @php
                        $found = true;
                    @endphp
                @break
            @endif
        @endforeach
        @if (!$found)
            ................
        @endif
    </font>
    <br>
    <font style="font-size: 9px; font-weight: 400;">
        5. Skor Nyeri :
    </font>
    <br>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
         @foreach ($res['d'] as $item) 
         @if ($item->emrdfk == '300000108' && $item->value == 1) checked
         @endif 
         @endforeach
        ng-model="item.obj[300000108]" />0 = Tidak Nyeri
   <br>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
        @foreach ($res['d'] as $item) 
        @if ($item->emrdfk == '300000109' && $item->value == 1) checked
        @endif 
        @endforeach
        ng-model="item.obj[300000109]" />1-2-3 = Sedikit Nyeri
  <br>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
         <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
         @foreach ($res['d'] as $item) 
         @if ($item->emrdfk == '300000110' && $item->value == 1) checked
         @endif 
         @endforeach
         ng-model="item.obj[300000110]" />4 = Agak Mengganggu
  <br>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
         <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
         @foreach ($res['d'] as $item) 
         @if ($item->emrdfk == '300000111' && $item->value == 1) checked
         @endif 
         @endforeach
         ng-model="item.obj[300000111]" />5-6-7 = Mengganggu aktivitas
  <br>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
         <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
          @foreach ($res['d'] as $item) 
          @if ($item->emrdfk == '300000112' && $item->value == 1) checked
          @endif 
          @endforeach
          ng-model="item.obj[300000112]" />8 = Sangat mengganggu
  <br>
     <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
          <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
           @foreach ($res['d'] as $item) 
           @if ($item->emrdfk == '300000113' && $item->value == 1) checked
           @endif 
           @endforeach
           ng-model="item.obj[300000113]" /> 9 - 10 = Tak Tertahankan
</td>
<td style="border-left:1px solid black;">
    <font style="font-size: 9px; font-weight: 400;text-decoration:underline;">
        Kemampuan Fungsional :
    </font>
    <br>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
        @foreach ($res['d'] as $item) 
        @if ($item->emrdfk == '3000757' && $item->value == 1) checked
        @endif 
        @endforeach
        ng-model="item.obj[3000757]" />1. Tidur
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
         @foreach ($res['d'] as $item) 
         @if ($item->emrdfk == '3000745' && $item->value == 1) checked
         @endif 
         @endforeach
         ng-model="item.obj[3000745]" />Bedrest
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
         <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
         @foreach ($res['d'] as $item) 
         @if ($item->emrdfk == '3000746' && $item->value == 1) checked
         @endif 
         @endforeach
         ng-model="item.obj[3000746]" />Gendong
    <br>
    <font style="font-size: 9px; font-weight: 400;">
           2. Jalan Sendiri :
    </font>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
         @foreach ($res['d'] as $item) 
         @if ($item->emrdfk == '3000747' && $item->value == 1) checked
         @endif 
         @endforeach
         ng-model="item.obj[3000747]" />Ya
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
        @foreach ($res['d'] as $item) 
        @if ($item->emrdfk == '3000748' && $item->value == 1) checked
        @endif 
        @endforeach
        ng-model="item.obj[3000748]" />Tidak
    <br>
    <font style="font-size: 9px; font-weight: 400;">
           3. Kursi Roda :
    </font>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
        @foreach ($res['d'] as $item) 
        @if ($item->emrdfk == '3000749' && $item->value == 1) checked
        @endif 
        @endforeach
        ng-model="item.obj[3000749]" />Ya
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
        @foreach ($res['d'] as $item) 
        @if ($item->emrdfk == '3000750' && $item->value == 1) checked
        @endif 
        @endforeach
        ng-model="item.obj[3000750]" />Tidak
    <br>
    <font style="font-size: 9px; font-weight: 400;">
          4. Alat Bantu :
    </font>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
       <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
       @foreach ($res['d'] as $item) 
       @if ($item->emrdfk == '3000751' && $item->value == 1) checked
       @endif 
       @endforeach
       ng-model="item.obj[3000751]" />Ya
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
       <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
       @foreach ($res['d'] as $item) 
       @if ($item->emrdfk == '3000752' && $item->value == 1) checked
       @endif 
       @endforeach
       ng-model="item.obj[3000752]" />Tidak
    <br>
    <font style="font-size: 9px; font-weight: 400;">
           5. Prothese :
    </font>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
       <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
        @foreach ($res['d'] as $item) 
        @if ($item->emrdfk == '3000753' && $item->value == 1)
        checked
        @endif 
        @endforeach
        ng-model="item.obj[3000753]" />Ya
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
         @foreach ($res['d'] as $item) 
         @if ($item->emrdfk == '3000754' && $item->value == 1) checked
         @endif 
         @endforeach
         ng-model="item.obj[3000754]" />Tidak
    <br>
    
    <font style="font-size: 9px; font-weight: 400;">
        6. Deformitas :
    </font>
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
       <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
       @foreach ($res['d'] as $item) 
       @if ($item->emrdfk == '3000755' && $item->value == 1) checked
       @endif 
       @endforeach
       ng-model="item.obj[3000755]" />Ya
    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
       <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
       @foreach ($res['d'] as $item) 
       @if ($item->emrdfk == '3000756' && $item->value == 1) checked
       @endif 
       @endforeach
       ng-model="item.obj[3000756]" />Tidak
                                                            

        </td>

       </tr>

  </table>

</td>
<td></td>

</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;" colspan="3">
        &nbsp;&nbsp; <font style="font-size: 9px; font-weight: bold;">
            Risiko Jatuh ( Modifikasi Time Up and Go Test )
        </font>
        <br>
        <table rules="all" style="width:75%;border:1px solid black;">
            <tr>
              <th style="border-right:1px solid black;">No</th>
              <th style="border-right:1px solid black;">Penilaian</th>
              <th style="border-right:1px solid black;">Ya</th>
              <th>Tidak</th>
            </tr>
            <tr style="border-right:1px solid black;">
              <td>1.</td>
              <td>
                <font style=" font-size:9px;">Cara berjalan pasien ( salah satu / lebih )</font>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
                <td></td>
              <td>
                <font style=" font-size: 9px;">a. Tidak seimbang / sempoyongan / limbung</font>
              </td>
              <td>
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
                    @foreach ($res['d'] as $item) 
                    @if ($item->emrdfk == '30006245' && $item->value == 1) checked
                    @endif 
                    @endforeach
                    ng-model="item.obj[30006245]" />Ya</td>
              <td><font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
                    @foreach ($res['d'] as $item) 
                    @if ($item->emrdfk == '30006246' && $item->value == 1) checked
                    @endif 
                    @endforeach
                    ng-model="item.obj[30006246]" />Tidak</td>
            </tr>
            <tr>
                <td></td>
              <td>
                <font style=" font-size: 9px;">b. Jalan dengan alat bantu ( kruk, tripot, kursi roda, orang lain)</font>
              </td>
              <td>
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
                    @foreach ($res['d'] as $item) 
                    @if ($item->emrdfk == '30006247' && $item->value == 1) checked
                    @endif 
                    @endforeach
                    ng-model="item.obj[30006247]" />Ya</td>
              <td><font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
                    @foreach ($res['d'] as $item) 
                    @if ($item->emrdfk == '30006248' && $item->value == 1) checked
                    @endif 
                    @endforeach
                    ng-model="item.obj[30006248]" />Tidak</td>
            </tr>
            <tr>
                <td>2.</td>
              <td>
                <font style=" font-size: 9px;">Ada keterbatasan gerak</font>
              </td>
              <td>
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
                    @foreach ($res['d'] as $item) 
                    @if ($item->emrdfk == '30006249' && $item->value == 1) checked
                    @endif 
                    @endforeach
                    ng-model="item.obj[30006249]" />Ya</td>
              <td><font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;"
                    @foreach ($res['d'] as $item) 
                    @if ($item->emrdfk == '30006250' && $item->value == 1) checked
                    @endif 
                    @endforeach
                    ng-model="item.obj[30006250]" />Tidak</td>
            </tr>
            
          </table>
    </td>

</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;border-bottom:1px solid black;" colspan="3">
        <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
            <input type="checkbox"
                style="transform: scale(0.8); margin-top:6.5px; !important;"
                @foreach ($res['d'] as $item)
                @if ($item->emrdfk == '30006251' && $item->value == 1) checked
                @endif 
                @endforeach
                ng-model="item.obj[30006251]" />Tidak Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point a / b
           
        </font>
        <br>
        <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
            <input type="checkbox"
                style="transform: scale(0.8); margin-top:6.5px; !important;"
                @foreach ($res['d'] as $item)
                @if ($item->emrdfk == '30006252' && $item->value == 1) checked
                @endif 
                @endforeach
                ng-model="item.obj[30006252]" />Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point a / b
           
        </font>
        <br>
        <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
            <input type="checkbox"
                style="transform: scale(0.8); margin-top:6.5px; !important;"
                @foreach ($res['d'] as $item)
                @if ($item->emrdfk == '300000114' && $item->value == 1) checked
                @endif 
                @endforeach
                ng-model="item.obj[300000114]" />Risiko Jatuh Tinggi, bila ditemukan 1 dan 2
           
        </font>
        <br>
        <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
            <input type="checkbox"
                style="transform: scale(0.8); margin-top:6.5px; !important;"
                @foreach ($res['d'] as $item)
                @if ($item->emrdfk == '300000115' && $item->value == 1) checked
                @endif 
                @endforeach
                ng-model="item.obj[300000115]" />Tidak dapat dilakukan pengkajian Risiko Jatuh
           
        </font>
        <br>
        <font style="font-size: 9px; font-weight: 400;">
            Tindakan :
        </font>
        <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
            <input type="checkbox"
                style="transform: scale(0.8); margin-top:6.5px; !important;"
                @foreach ($res['d'] as $item)
                @if ($item->emrdfk == '300000116' && $item->value == 1) checked
                @endif 
                @endforeach
                ng-model="item.obj[300000116]" />Edukasi
           
        </font>
        <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
            <input type="checkbox"
                style="transform: scale(0.8); margin-top:6.5px; !important;"
                @foreach ($res['d'] as $item)
                @if ($item->emrdfk == '300000117' && $item->value == 1) checked
                @endif 
                @endforeach
                ng-model="item.obj[300000117]" />Pemberian Tanda Risiko Jatuh
           
        </font>
        <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
            <input type="checkbox"
                style="transform: scale(0.8); margin-top:6.5px; !important;"
                @foreach ($res['d'] as $item)
                @if ($item->emrdfk == '300000118' && $item->value == 1) checked
                @endif 
                @endforeach
                ng-model="item.obj[300000118]" />Pemberian Tempat Duduk Prioritas
           
        </font>
    </td>
</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;" colspan="3">
        <font style="font-size: 9px; font-weight: 400;">
            1. Pemeriksaan Sistemik Khusus : *)
        </font>
        <br>
        &nbsp; <font style="font-size: 9px; font-weight: 400;">
            a. Musculoskeletal :
        </font>
        <font style="font-size: 9px; ">
            @php
                $found = false;
            @endphp
            @foreach ($res['d'] as $item)
                @if ($item->emrdfk == 30006253 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                        $found = true;
                    @endphp
                @break
            @endif
        @endforeach
        @if (!$found)
            ................
        @endif
    </font>
    <br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        b. Neuromuscular :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006254 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>
<br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        c. CardioPulmonal :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006255 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>
<br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        d. Pediatri :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006256 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>
<br>
<font style="font-size: 9px; font-weight: 400;">
    *) Pemeriksaan dilakukan sesuai dengan Telaah Sistem yang dilakukan
</font>
    </td>
</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;" colspan="3">
        <font style="font-size: 9px; font-weight: 400;">
            2. Pengukuran Khusus
        </font>
        <br>
        &nbsp; <font style="font-size: 9px; font-weight: 400;">
            a. Musculoskeletal :
        </font>
        <font style="font-size: 9px; ">
            @php
                $found = false;
            @endphp
            @foreach ($res['d'] as $item)
                @if ($item->emrdfk == 30006257 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                        $found = true;
                    @endphp
                @break
            @endif
        @endforeach
        @if (!$found)
            ................
        @endif
    </font>
    <br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        b. Neuromuscular :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006258 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>
<br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        c. CardioPulmonal :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006259 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>
<br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        d. Pediatri :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006260 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>
<br>
<font style="font-size: 9px; font-weight: 400;">
    *) Pemeriksaan dilakukan sesuai dengan Telaah Sistem yang dilakukan
</font>
    </td>
</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;" colspan="3">
        <font style="font-size: 9px; font-weight: 400;">
            3. Data Penunjang
        </font>
        <br>
        &nbsp; <font style="font-size: 9px; font-weight: 400;">
            a. Radiologi :
        </font>
        <font style="font-size: 9px; ">
            @php
                $found = false;
            @endphp
            @foreach ($res['d'] as $item)
                @if ($item->emrdfk == 30006261 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                        $found = true;
                    @endphp
                @break
            @endif
        @endforeach
        @if (!$found)
            ................
        @endif
    </font>
    <br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        b. EMG :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006262 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>
<br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        c. Laboratorium :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006263 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>
<br>
    &nbsp; <font style="font-size: 9px; font-weight: 400;">
        d. Lain-lain :
    </font>
    <font style="font-size: 9px; ">
        @php
            $found = false;
        @endphp
        @foreach ($res['d'] as $item)
            @if ($item->emrdfk == 30006264 && !empty($item->value))
                {!! $item->value !!} 
                @php
                    $found = true;
                @endphp
            @break
        @endif
    @endforeach
    @if (!$found)
        ................
    @endif
</font>

    </td>
</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
        <font style="font-weight: bold; font-size: 10px;">C. Diagnosis Fisioterapi :</font>
        <br>
        <font style="font-size: 9px; ">
            @php
                $found = false;
            @endphp
            @foreach ($res['d'] as $item)
                @if ($item->emrdfk == 30006265 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                        $found = true;
                    @endphp
                @break
            @endif
        @endforeach
        @if (!$found)
            ................
        @endif
    </font>
    </td>

</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
        <font style="font-weight: bold; font-size: 10px;">D. Program / Rencana Terapi :</font>
        <br>
        <font style="font-size: 9px; ">
            @php
                $found = false;
            @endphp
            @foreach ($res['d'] as $item)
                @if ($item->emrdfk == 30006266 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                        $found = true;
                    @endphp
                @break
            @endif
        @endforeach
        @if (!$found)
            ................
        @endif
    </font>
    </td>

</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
        <font style="font-weight: bold; font-size: 10px;">E. Intervensi :</font>
        <table rules="all" style="width:75%;border:1px solid black;">
            <tr>
              <th style="border-right:1px solid black;">Tanggal</th>
              <th style="border-right:1px solid black;">Intervensi</th>
              <th style="border-right:1px solid black;">Tempat / Area yang diterapi</th>
              
            </tr>
            <tr style="border-right:1px solid black;">
              <td>
                <font style="font-size: 9px; ">
                    @php
                        $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30006267 && !empty($item->value))
                            {!! $item->value !!} 
                            @php
                                $found = true;
                            @endphp
                        @break
                    @endif
                @endforeach
                @if (!$found)
                    ................
                @endif
            </font>
                
                </td>
              <td>
                <font style="font-size: 9px; ">
                    @php
                        $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30006268 && !empty($item->value))
                            {!! $item->value !!} 
                            @php
                                $found = true;
                            @endphp
                        @break
                    @endif
                @endforeach
                @if (!$found)
                    ................
                @endif
            </font>
               
              </td>
              <td>
                <font style="font-size: 9px; ">
                    @php
                        $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30006269 && !empty($item->value))
                            {!! $item->value !!} 
                            @php
                                $found = true;
                            @endphp
                        @break
                    @endif
                @endforeach
                @if (!$found)
                    ................
                @endif
            </font> 
              </td>

            </tr>
            <tr style="border-right:1px solid black;">
                <td>
                  <font style="font-size: 9px; ">
                      @php
                          $found = false;
                      @endphp
                      @foreach ($res['d'] as $item)
                          @if ($item->emrdfk == 300000119 && !empty($item->value))
                              {!! $item->value !!} 
                              @php
                                  $found = true;
                              @endphp
                          @break
                      @endif
                  @endforeach
                  @if (!$found)
                      ................
                  @endif
              </font>
                  
                  </td>
                <td>
                  <font style="font-size: 9px; ">
                      @php
                          $found = false;
                      @endphp
                      @foreach ($res['d'] as $item)
                          @if ($item->emrdfk == 300000120 && !empty($item->value))
                              {!! $item->value !!} 
                              @php
                                  $found = true;
                              @endphp
                          @break
                      @endif
                  @endforeach
                  @if (!$found)
                      ................
                  @endif
              </font>
                 
                </td>
                <td>
                  <font style="font-size: 9px; ">
                      @php
                          $found = false;
                      @endphp
                      @foreach ($res['d'] as $item)
                          @if ($item->emrdfk == 300000121 && !empty($item->value))
                              {!! $item->value !!} 
                              @php
                                  $found = true;
                              @endphp
                          @break
                      @endif
                  @endforeach
                  @if (!$found)
                      ................
                  @endif
              </font> 
                </td>
                
              </tr>
              <tr style="border-right:1px solid black;">
                <td>
                  <font style="font-size: 9px; ">
                      @php
                          $found = false;
                      @endphp
                      @foreach ($res['d'] as $item)
                          @if ($item->emrdfk == 300000122 && !empty($item->value))
                              {!! $item->value !!} 
                              @php
                                  $found = true;
                              @endphp
                          @break
                      @endif
                  @endforeach
                  @if (!$found)
                      ................
                  @endif
              </font>
                  
                  </td>
                <td>
                  <font style="font-size: 9px; ">
                      @php
                          $found = false;
                      @endphp
                      @foreach ($res['d'] as $item)
                          @if ($item->emrdfk == 300000123 && !empty($item->value))
                              {!! $item->value !!} 
                              @php
                                  $found = true;
                              @endphp
                          @break
                      @endif
                  @endforeach
                  @if (!$found)
                      ................
                  @endif
              </font>
                 
                </td>
                <td>
                  <font style="font-size: 9px; ">
                      @php
                          $found = false;
                      @endphp
                      @foreach ($res['d'] as $item)
                          @if ($item->emrdfk == 300000124 && !empty($item->value))
                              {!! $item->value !!} 
                              @php
                                  $found = true;
                              @endphp
                          @break
                      @endif
                  @endforeach
                  @if (!$found)
                      ................
                  @endif
              </font> 
                </td>
                
              </tr>
           
            
            
          </table>
   

    </td>
</tr>
<tr>
    <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
        <font style="font-weight: bold; font-size: 10px;">F. Evaluasi :</font>
        <br>
        <font style="font-size: 9px; ">
            @php
                $found = false;
            @endphp
            @foreach ($res['d'] as $item)
                @if ($item->emrdfk == 30006270 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                        $found = true;
                    @endphp
                @break
            @endif
        @endforeach
        @if (!$found)
            ................
        @endif
    </font>
    </td>

</tr>
<tr>
    <td></td>

    <td style="font-size: 8pt;padding-top:12px;" colspan="2">
        <table style=" padding: 3px;" width="100%" >
            <tbody style="text-align: center;">
                <tr>
                    <td width="25%" style="text-align: center"></td>
                    <td width="25%"></td>
                    <td width="50%" >
                        Tanggal, @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30006271 && !empty($item->value))
                        {!! $item->value !!}
                        @break
                        @endif
                        @endforeach
                    </td>
                </tr>
                <tr>
                    <td width="33%" style="text-align: center;"></td>
                    <td width="33%"></td>
                    <td  width="33%">
                        Fisioterapis
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
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30006372 && !empty($item->value))
                        {!! $item->split !!}
                        @break
                        @endif
                        @endforeach
                        {{-- {{isset($item[3018854]) ? $item[3018854]:''}} --}}
                        
                    </td>
                </tr>
              
            </tbody>
        </table>
    </td>
    </tr>


</table>



</section>

</body>

</html>
