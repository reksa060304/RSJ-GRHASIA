<html>
<head>
    <title>
        Report
    </title>
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
    @media print 
    {
        @page
        {
            size: 16cm 21cm;
            margin: 0;
            /* size: portrait; */
        }
    }
</style>
<style>
    tr td {
        /*padding:2px 4px 2px 4px;*/
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
            <td style="padding: 30px 0px">
                <div align="center">
                    <p align="right">
                          <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" height="133" border="0" width="80%" align="center" style="text-align: center">
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
                                            <table cellspacing="0" cellpadding="0" border="0" width="80%" align="center">
                                                <tbody>
                                                <tr>
                                                    <td width="105">
                                                    <p align="left">
                                                        <img src="{{ asset('img/logo_t.png') }}"
                                                             style="width: 80px" border="0"/>
                                                    </p>
                                                 </td>
                                                <td align="" >
                                                    <div style="margin-left: 0px">
                                                    <b>
                                                        <font size="1"  color="#000000">{{ $profile[0]->namapemerintahan }}</font>
                                                        <br>
                                                    </b>
                                                        <font size="1"  color="#000000">{{ $profile[0]->namalengkap }}</font>
                                                        <br>
                                                    <font size="1" size="1" color="#000000">
                                                        {{ $profile[0]->alamatlengkap }}
                                                        <br>
                                                        Telp.  {{ $profile[0]->fixedphone }} Fax. {{ $profile[0]->faksimile }}
                                                       <font size="1">
                                                    </div>
                                                </td>
                                                <td align="" >
                                                    <div style="margin-right: 300px">
                                                    <b>
                                                        <font size="1" style="font-size: 14pt" color="#000000">RESEP</font>
                                                        <br>
                                                    </b>
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
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="80%" align="center">
                <tbody valign="top">
                <tr>
                    <td height="5"  width="15%">
                        <font size="1"  >Status Pembiayaan</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"  width="30%"><font size="1"  >{{ $raw->kelompokpasien }}</font></td>
                    <td height="5" width="16%">
                        <font size="1"  >Sumber Resep</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"><font size="1"  >{{ $raw->namaruangan }} </font></td>
                </tr>
                <tr>
                    <td height="5"  width="15%">
                        <font size="1"  >No. Rekam Medik</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"  width="30%"><font size="1"  >{{ $raw->nocm }}</font></td>
                    <td height="5" width="16%">
                        <font size="1"  >Tanggal Resep</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"><font size="1"  >{{ $raw->tglorder }} </font></td>
                </tr>
                <tr>
                    <td height="5"  width="15%">
                        <font size="1"  >Nama Pasien</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"  width="30%"><font size="1"  >{{ $raw->namapasien }}</font></td>
                    <td height="5" width="16%">
                        <font size="1"  >Nama Dokter</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"><font size="1"  >{{ $raw->namalengkap }} </font></td>
                </tr>
                <tr>
                    <td height="5"  width="15%">
                        <font size="1"  >Tanggal Lahir</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"  width="30%"><font size="1"  >{{ $raw->tgllahir }} ({{ $raw->umur}})</font></td>
                    <td height="5" width="16%">
                        <font size="1"  >Nomor Izin Praktek</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"><font size="1"  >{{ $raw->nosip }} </font></td>
                </tr>
                <tr>
                    <td height="5"  width="15%">
                        <font size="1"  >Jenis Kelamin</font>
                    </td>
                    <td height="5"><font size="1"  >:</font></td>
                    <td height="5"  width="10%"><font size="1"  >{{ $raw->jeniskelamin }}</font></td>
                </tr>
            </tbody>
            </table>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="80%" align="center">
                <tbody valign="top">
                <tr>
                    <td height="5"><font size="1"  >R/Ke</font></td>
                    <td height="5"><font size="1"  >Nama Perbekalan Farmasi</font></td>
                    <td height="5"><font size="1"  >Dosis</font></td>
                    <td height="5"><font size="1"  >Jumlah</font></td>
                    <td height="5"><font size="1"  >Rute</font></td>
                    <td height="5"><font size="1"  >Aturan Pakai</font></td>
                    <td height="5"><font size="1"  >Paraf</font></td>
                </tr>
                <?php foreach ($details as $d){ ?>
                    <tr>
                        <td height="5"><font size="1"  ><?= $d->rke; ?></font></td>
                        <td height="5"><font size="1"  ><?= $d->namaproduk; ?></font></td>
                        <td height="5"><font size="1"  ><?= $d->kekuatan; ?></font></td>
                        <td height="5"><font size="1"  ><?= $d->jumlah; ?></font></td>
                        <td height="5"><font size="1"  ></font></td>
                        <td height="5"><font size="1"  ><?= $d->aturanpakai; ?></font></td>
                    </tr>
                <?php } ?>
            </tbody>
            </table>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="5">
            <table cellspacing="0" cellpadding="0" border="1" width="80%" align="center">
                <tbody valign="top">
                    <tr>
                        <td align="center" colspan="8" height="5">
                            <font size="1" size="1" style="font-weight:bold;">Diisi Farmasi</font>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" height="5" width="25%" style="border-bottom:none;"><font size="1" size="1" >Tahap I : Pengkajian & Klarifikasi</font></td>
                        <td colspan="2" height="5" width="25%" style="border-bottom:none;"><font size="1" size="1" >Tahap II : Penyiapan Obat</font></td>
                        <td colspan="2" height="5" width="25%" style="border-bottom:none;"><font size="1" size="1" >Tahap III : Dispening</font></td>
                        <td colspan="2" height="5" width="25%" style="border-bottom:none;"><font size="1" size="1" >Tahap VI : Serah & Informasi</font></td>
                    </tr>
                    <tr>
                        <td height="10" style="border-top:none;border-right:none;"><font size="1" size="1" >Jam</font></td>
                        <td height="10" style="border-top:none;border-left:none;"><font size="1" size="1" >Petugas</font></td>
                        <td height="10" style="border-top:none;border-right:none;"><font size="1" size="1" >Jam</font></td>
                        <td height="10" style="border-top:none;border-left:none;"><font size="1" size="1" >Petugas</font></td>
                        <td height="10" style="border-top:none;border-right:none;"><font size="1" size="1" >Jam</font></td>
                        <td height="10" style="border-top:none;border-left:none;"><font size="1" size="1" >Petugas</font></td>
                        <td height="10" style="border-top:none;border-right:none;"><font size="1" size="1" >Jam</font></td>
                        <td height="10" style="border-top:none;border-left:none;"><font size="1" size="1" >Petugas</font></td>
                    </tr>
               </tbody>
            </table>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="5">
            <table cellspacing="0" cellpadding="0" border="1" width="80%" align="center">
                <tbody valign="top">
                    <tr >
                        <td height="5" width="5%"></td>
                        <td height="5" width="5%"></td>
                        <td height="5" width="20%" align="center"><font size="1" size="1" style="">Kriteria Pemeriksaan</font></td>
                        <td height="5" width="5%" align="center"><font size="1" size="1" style="">&#10004;</font></td>
                        <td height="5" width="10%" align="center"><font size="1" size="1" style="">DRP</font></td>
                        <td height="5" width="5%" align="center" rowspan="8" style="vertical-align : middle;text-align:center; "><font size="1" size="1" style="writing-mode: vertical-rl;transform: rotate(180deg);" >Keabsahan&nbsp;Resep</font></td>
                        <td height="5" width="5%" rowspan="3" style="vertical-align : middle;text-align:center; "><font size="1" size="1" ></font></td>
                        <td height="5" width="20%"><font size="1" size="1" >5. Jumlah Obat</font></td>
                        <td height="5" width="5%"></td>
                        <td height="5" width="10%" rowspan="3"></td>
                    </tr>
                    <tr>
                        <td height="5" rowspan="11" style="vertical-align : middle;text-align:center; "><font size="1" size="1" style="writing-mode: vertical-rl;transform: rotate(180deg);" >Keabsahan&nbsp;Resep</font></td>
                        <td height="5" rowspan="7" style="vertical-align : middle;text-align:center; "><font size="1" size="1" style="writing-mode: vertical-rl;transform: rotate(180deg);" >Persyaratan Administratif</font></td>
                        <td height="5"><font size="1" size="1" >1. Nama Dokter</font></td>
                        <td height="5"></td>
                        <td height="5" rowspan="7"></td>
                        <td height="5" width="20%"><font size="1" size="1" >6. Stabilitas</font></td>
                        <td height="5" width="5%"></td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >2. SIP</font></td>
                        <td height="5"></td>
                        <td height="5" width="20%"><font size="1" size="1" >7. Aturan Cara Pakai</font></td>
                        <td height="5" width="5%"></td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >3. Alamat Dokter</font></td>
                        <td height="5"></td>
                        <td height="5" rowspan="5" style="vertical-align : middle;text-align:center;"><font size="1" size="1" style="writing-mode: vertical-rl;transform: rotate(180deg);" >Pertimbangan Klinis</font></td>
                        <td height="5" width="20%"><font size="1" size="1" >1. Adanya Alergi</font></td>
                        <td height="5" width="5%"></td>
                        <td height="5" width="10%" rowspan="5"></td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >4. Tgl Penulisan Resep</font></td>
                        <td height="5"></td>
                        <td height="5" width="20%"><font size="1" size="1" >2. Tepat Indikasi, Dosis Waktu</font></td>
                        <td height="5" width="5%"></td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >5. Ttd/Paraf Dokter</font></td>
                        <td height="5"></td>
                        <td height="5" width="20%"><font size="1" size="1" >3. Duplikasi Pengobatan</font></td>
                        <td height="5" width="5%"></td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >6. Nama, Alamat, Umur, Berat, dan Jenis Kelamin</font></td>
                        <td height="5"></td>
                        <td height="5" width="20%"><font size="1" size="1" >4. Kontraindikasi</font></td>
                        <td height="5" width="5%"></td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >7. Ruangan/Asal Resep</font></td>
                        <td height="5"></td>
                        <td height="5" width="20%"><font size="1" size="1" >5. Interaksi Obat</font></td>
                        <td height="5" width="5%"></td>
                    </tr>
                    <tr>
                        <td height="5" rowspan="4" style="vertical-align : middle;text-align:center;"><font size="1" size="1" style="writing-mode: vertical-rl;transform: rotate(180deg);" >Kesesuaian Farset</font></td>
                        <td height="5"><font size="1" size="1" >1. Nama Obat</font></td>
                        <td height="5"></td>
                        <td height="5" rowspan="4"></td>
                        <td height="5" colspan="3" style="border-bottom:none;border-right:none;"><font size="1" size="1" >Verifikasi 5 Benar</font></td>
                        <td height="5" colspan="2" rowspan="2" style="border-left:none;border-bottom:none;"><font size="1" size="1" >Ttd Pasien/Perawat</font></td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >2. Bentuk Sediaan</font></td>
                        <td height="5"></td>
                        <td height="5" colspan="3" style="border-top:none;border-bottom:none;border-right:none;">
                            <font size="1" size="1" style="display: inline-block;" ><div style="display: inline-block;height:10px;width:10px;border:1px solid black;"></div>&nbsp;Benar Pasien</font>
                            <font size="1" size="1" style="display: inline-block;" >&nbsp;&nbsp;<div style="display: inline-block;height:10px;width:10px;border:1px solid black;"></div>&nbsp;Benar Waktu</font>
                        </td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >3. Kekuatan Sediaan</font></td>
                        <td height="5"></td>
                        <td height="5" colspan="3" style="border-top:none;border-bottom:none;border-right:none;">
                            <font size="1" size="1" style="display: inline-block;" ><div style="display: inline-block;height:10px;width:10px;border:1px solid black;"></div>&nbsp;Benar Obat</font>
                            <font size="1" size="1" style="display: inline-block;" >&nbsp;&nbsp;&nbsp;&nbsp;<div style="display: inline-block;height:10px;width:10px;border:1px solid black;"></div>&nbsp;Benar Rute</font>
                        </td>
                        <td height="5" colspan="2" rowspan="2" style="border-left:none;border-top:none;"><font size="1" size="1" >Ttd Apoteker</font></td>
                    </tr>
                    <tr>
                        <td height="5"><font size="1" size="1" >4. Dosis Obat</font></td>
                        <td height="5"></td>
                        <td height="5" colspan="3" style="border-top:none;border-right:none;"><font size="1" size="1" style="display: inline-block;" ><div style="display: inline-block;height:10px;width:10px;border:1px solid black;"></div>&nbsp;Benar Pasien</font></td>
                    </tr>
                </tbody>
            </table>
        </td> 
    <tr>
    
<!--    <tr>

        <td style="border-top:1px solid #000;border-bottom:1px solid #000;border-width: medium">
            <font size="1" style="font-size: 11pt"  color="#000000">
                    <span style="font-weight: 700;font-size: 12pt">
                    </span>
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
                <tr>
                    <td height="25"  width="15%">
                        <font size="1"  >No. Rekam Medik</font>
                    </td>
                    <td >:</td>
                    <td height="25"  width="30%"><font size="1"  > {{ $raw->nocm }}</font></td>
                    <td height="25" width="16%">
                        <font size="1"  >No. PA</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font size="1"  >s </font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font size="1"  >Tanggal Terima</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font size="1"  ></font></td>


                    <td height="25" width="15%">
                        <font size="1"  >Nama Pasien</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font size="1"  ></font></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font size="1"  >Tanggal Jawab</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font size="1"  ></font></td>

                    <td height="25" width="105">
                        <font size="1"  >Jenis Kelamin / Umur</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font size="1"  ></font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font size="1"  >Pembayaran</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font size="1"  ></font></td>

                    <td height="25" width="105">
                        <font size="1"  >Alamat</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font size="1"  ></font></td>

                </tr>

                <tr>
                    <td height="25" width="92">
                        <font size="1"  >Dokter Pengirim</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font size="1"  ></font></td>
                    <td height="25" width="105">
                        <font size="1"  >Ruangan</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font size="1"  > </font></td>

                </tr>
{{--                <tr>--}}
{{--                    <td height="25" width="92">--}}
{{--                        <font size="1"  >Asal Rujukan</font>--}}
{{--                    </td>--}}
{{--                    <td>:</td>--}}
{{--                    <td height="25" width="401"><font size="1"  ></font></td>--}}


{{--                </tr>--}}
                <tr>
                    <td height="25" width="92">
                        <font size="1"  >Topografi</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font size="1"  ></font></td>
                    <td height="25" width="105">
                        <font size="1"  >Morfologi</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font size="1"  > </font></td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>

    <tr>
        <td>
            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px">
                <tbody valign="top" >
                <tr>
                    <td height="25" width="25%">
                       <b> DIAGNOSIS KLINIK</b>
                    </td>
                    <td>:</td>
                    <td height="35">
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b>  KETERANGAN KLINIK</b>
                    </td>
                    <td>:</td>
                    <td height="35">
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                       <b> DIAGNOSIS PB</b>
                    </td>
                    <td>:</td>
                    <td height="35"> 
                    </td>
                </tr>
                <tr>
                    <td height="25">
                        <b>KETERANGAN PB</b>
                    </td>
                    <td>:</td>
                    <td height="35"> 
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b> MAKROSKOPIK</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                    </td>
                </tr>
                <tr>
                    <td height="25">
                        <b> MIKROSKOPIK</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b> KESIMPULAN</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b> ANJURAN</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                    </td>
                </tr>
                </tbody>
            </table>
        </td>

    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr >
        <td>
            <table style="margin-top:15px;">
                <tr>
                    <td width="500"></td>
                </tr>
                <tr>
                    <td ></td>
                    <td style="text-align: center">
                        <font size="1"  >Cibinong, {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }}</font>
                        <br>
{{--                        <font size="1" style="font-size: 10pt;" ></font>--}}
                    </td>
                </tr>
                <tr>
                    <td height="150"></td>
                    <td style="text-align: center">
                        <font size="1"  >
                            <u>
                            </u>
                            <br>
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
    </div> -->
</body>
</html>
