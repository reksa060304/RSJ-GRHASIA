<html>
<head>
    <title>
        Report
    </title>
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
    @page {
        size: auto;   /* auto is the initial value */
        margin: 0;  /* this affects the margin in the printer settings */
    }
</style>
<style>
    tr td {
        padding:2px 4px 2px 4px;
    }
    .borderss{
        border-bottom: 1px solid black;
    }
    body{
        font-family: Tahoma, Geneva, sans-serif;
    }

</style>
<body style="background-color: #CCCCCC">
<div align="center">
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}">
        <tbody>
        <tr>
            <td style="padding: 30px">
                <div align="center">
                    <p align="right">
                          <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" height="133" border="0" width="100%" style="text-align: center">
                            <tbody>
                            <tr>
                                <td style="text-align:left">
                                    <div align="center">
                                        <table cellspacing="0" cellpadding="0" height="74" border="0" width="850">
                                            <tbody>
                                            <tr>
                                                <td valign="top"></td>
                                            </tr>
                                            <tr>
                                        <td valign="top">
                                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="right">
                                                        <p >
                                                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                                                        <img src="{{ asset('img/LOGO GRHASIA.png') }}"
                                                                style="width: 100px; margin-left: 180px;" border="0"/>
                                                        @else
                                                        <img src="{{ asset('service/img/LOGO GRHASIA.png') }}"
                                                                style="width: 100px; margin-left: 180px;" border="0"/>
                                                        @endif
                                                            
                                                        </p>
                                                    </td>
                                                    <td align="center" >
                                                        <div style="margin-left: -180px;">
                                                        <b>
                                                            <font style="font-size: 14pt" color="#000000">INSTALASI LABORATORIUM</font>
                                                            <br>
                                                        </b>
                                                            <font style="font-size: 12pt; font-weight: bold;" color="#000000">RS JIWA GRAHASIA DIY <br> Pemba Daerah Istimewa Yogyakarta</font>
                                                            <br>
                                                        <font size="3" color="#000000">
                                                            Jln. Kaliurang KM. 17
                                                            <br>
                                                            Telp.895297, 895143, 895142
                                                            <br>
                                                            YOGYAKARTA
                                                        <font>
                                                        </div>
                                                    </td>
                                                </tr>
                                <tr>
                                <td width="105">&nbsp;</td>
                                <td>&nbsp;</td>
                        </tr>
                        </tbody>
                    </table>
                    </td>
                    </tr>
                    </tbody>
    </table>
</div>

</td>
</tr>
    <tr>

        <td style="border-top:1px solid #000;border-bottom:1px solid #000;border-width: medium">
            <font style="font-size: 11pt"  color="#000000">
                    @if($r['jenis'] !='mdt')
                    <span style="font-weight: 700;font-size: 12pt">
                        HASIL PEMERIKSAAN {{ $r['jenis'] =='his'? 'HISTOPATOLOGI' : 'SITOLOGI' }}
                    </span>
                    @else
                    <span style="font-weight: 700;font-size: 12pt">
                        HASIL PEMERIKSAAN
                    </span>
                    @endif
            </font>
        </td>

    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody valign="top">
                <p style="text-align: left;font-weight: bold"> DATA REGISTRASI</p>
                @if($r['jenis'] =='mdt')
                <tr>
                    <td height="25" width="15%">
                        <font style="font-size: 12pt" >Nama</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 12pt" >{{   $raw->namapasien  }}</font></td>

                    <td height="25" width="92">
                        <font style="font-size: 12pt" >Tanggal</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 12pt" >{{ date('Y-m-d H:m', strtotime($raw->tgljawab))  }} </font></td>

                </tr>
                <tr>
                    <td height="25" width="16%">
                        <font style="font-size: 12pt" >Tanggal lahir</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 12pt" >{{ $raw->tgllahir  }}  </font></td>

                    <td height="25"  width="15%">
                        <font style="font-size: 12pt" >No RM</font>
                    </td>
                    <td >:</td>
                    <td height="25"  width="30%"><font style="font-size: 12pt" > {{ $raw->nocm }}</font></td>
                </tr>
                <tr>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" >Alamat</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 12pt" >{{  $raw->alamatlengkap }} </font></td>

                    <td height="25" width="82">
                        <font style="font-size: 12pt" >No Lab</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 12pt" >{{ $raw->noorder   }} </font></td>
                </tr>

                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 12pt" >Pengirim</font>
                    </td>
                    <td>:</td>
                    @php 
                        if (empty($raw->dokterluar)) {
                            $dokterPengirim = $raw->namadokterpengirim;
                        }
                        else {
                            $dokterPengirim = $raw->dokterluar;
                        }
                    @endphp
                    <td height="25" width="401"><font style="font-size: 12pt" >{{ $dokterPengirim }} </font></td>
                </tr>
                @else
                <tr>
                    <td height="25"  width="15%">
                        <font style="font-size: 12pt" >No. Rekam Medik</font>
                    </td>
                    <td >:</td>
                    <td height="25"  width="30%"><font style="font-size: 12pt" > {{ $raw->nocm }}</font></td>
                    <td height="25" width="16%">
                        <font style="font-size: 12pt" >No. PA</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 12pt" >{{ $raw->nomorpa  }}  </font></td>

                </tr>
                
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 12pt" >Tanggal Jawab</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 12pt" >{{ $raw->tgljawab  }} </font></td>

                    <td height="25" width="105">
                        <font style="font-size: 12pt" >Jenis Kelamin / Umur</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 12pt" >{{  $raw->umur }} </font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 12pt" >Pembayaran</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 12pt" >{{ $raw->kelompokpasien   }} </font></td>

                    <td height="25" width="105">
                        <font style="font-size: 12pt" >Alamat</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 12pt" >{{  $raw->alamatlengkap }} </font></td>

                </tr>

                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 12pt" >Dokter Pengirim</font>
                    </td>
                    <td>:</td>
                    @php 
                        if (empty($raw->dokterluar)) {
                            $dokterPengirim = $raw->namadokterpengirim;
                        }
                        else {
                            $dokterPengirim = $raw->dokterluar;
                        }
                    @endphp
                    <td height="25" width="401"><font style="font-size: 12pt" >{{ $dokterPengirim }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" >Ruangan</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 12pt" > {{ $raw->asal }}</font></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 12pt" >Topografi</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 12pt" >{{  $raw->topografi   }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 12pt" >Morfologi</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 12pt" >{{ $raw->morfologi  }}  </font></td>
                </tr>
                @endif
                </tbody>
            </table>
        </td>
    </tr>

    @if($r['jenis'] =='mdt')
    
    <tr>
        <td>
            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px">
            <p style="text-align: left;font-weight: bold; margin-top: 30px;"> GAMBARAN DARAH TEPI</p>
                <tbody valign="top" style="font-size: 12pt">
                <tr>
                    <td height="25" width="25%">
                       Eritrosit
                    </td>
                    <td>:</td>
                    <td height="55">
                        {{ $raw->eritrosit  }}
                    </td>
                </tr>
                <tr>
                    <td height="25" width="25%">
                       Lekosit
                    </td>
                    <td>:</td>
                    <td height="55">
                        {{ $raw->lekosit  }}
                    </td>
                </tr>
                <tr>
                    <td height="25" width="25%">
                       Trombosit
                    </td>
                    <td>:</td>
                    <td height="55">
                        {{ $raw->trombosit  }}
                    </td>
                </tr>
                <tr>
                    <td height="25" width="25%">
                       Kesan
                    </td>
                    <td>:</td>
                    <td height="55">
                        {{ $raw->kesan  }}
                    </td>
                </tr>
                <tr>
                    <td height="25" width="25%">
                       Kesimpulan
                    </td>
                    <td>:</td>
                    <td height="55">
                        {{ $raw->kesimpulanmdt  }}
                    </td>
                </tr>
                <tr>
                    <td height="25" width="25%">
                       Saran
                    </td>
                    <td>:</td>
                    <td height="85">
                        {{ $raw->saran  }}
                    </td>
                </tr>
                </tbody>
            </table>
        </td>

    </tr>
    <tr>
        <td height="25" width="75%" style="font-size: 12pt; text-align: left;">
        <u>Catatan :</u><br>
        <p style="margin-left: 30px;">Jika sekiranya ada keraguan tentang hasil pemeriksaan, diharapkan segera menghubungi laboratorium klinik RSJ. Grhasia</p>
        </td>
    </tr>
    @else
    <tr>
        <td>
            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px">
                <tbody valign="top" style="font-size: 12pt">
                <tr>
                    <td height="25" width="25%">
                       <b> DIAGNOSIS KLINIK</b>
                    </td>
                    <td>:</td>
                    <td height="35">
                        {{ $raw->diagnosaklinik  }}
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b>  KETERANGAN KLINIK</b>
                    </td>
                    <td>:</td>
                    <td height="35">
                        {{ $raw->keteranganklinik  }}
                    </td>
                </tr>
              @if($r['jenis'] =='his' &&  $raw->diagnosapb !=null)
                <tr>
                    <td height="25" >
                       <b> DIAGNOSIS PB</b>
                    </td>
                    <td>:</td>
                    <td height="35"> {{ $raw->diagnosapb  }}
                    </td>
                </tr>
                <tr>
                    <td height="25">
                        <b>KETERANGAN PB</b>
                    </td>
                    <td>:</td>
                    <td height="35"> {{ $raw->keteranganpb  }}
                    </td>
                </tr>
                @endif
                <tr>
                    <td height="25" >
                        <b> MAKROSKOPIK</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                         {!!  nl2br(str_replace('~','<br/>',$raw->makroskopik )) !!}
                    </td>
                </tr>
                <tr>
                    <td height="25">
                        <b> MIKROSKOPIK</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                        {!! nl2br(str_replace('~','<br/>',$raw->mikroskopik )) !!}
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b> KESIMPULAN</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                      {!!  nl2br(str_replace('~','<br/>',$raw->kesimpulan ))!!}
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b> ANJURAN</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                        {!!  nl2br(str_replace('~','<br/>',$raw->anjuran ))!!}
                    </td>
                </tr>
                </tbody>
            </table>
        </td>

    </tr>
    @endif
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr >
        <td>
            <table style="margin-top:75px;">
                <tr>
                    <td width="500"></td>
                </tr>
                <tr>
                    <td ></td>
                    <td style="text-align: center">
                        <font style="font-size: 12pt" >Pemeriksa</font>
                        <br>
{{--                        <font style="font-size: 12pt;" ></font>--}}
                    </td>
                </tr>
                <tr>
                    <td height="200"></td>
                    <td style="text-align: center">
                        <font  style="font-size: 12pt">
                            <u>{{  $raw->namapenanggungjawab }}</u>
                            <br>
                              {{ $raw->nosip != null? '('.$raw->nosip.')' :'NIP. 19811106 200604 2 013' }}
                        </font>
                    </td>
                </tr>
            </table>
        </td>
    </tr>



    </tbody>
    </table>
    </p>
    </div>
    </td>

    </tr>

    </tbody>
    </table>
    </div>
</body>
</html>
