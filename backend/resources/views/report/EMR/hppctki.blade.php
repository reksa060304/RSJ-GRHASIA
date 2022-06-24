<html>

<head>
    <title>
        Report
    </title>
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    @else
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
    @endif

</head>
<style type="text/css" media="print">
    @page {
        size: auto;
        /* auto is the initial value */
        margin: 0;
        /* this affects the margin in the printer settings */
    }
</style>
<style>
    tr td {
        padding: 2px 4px 2px 4px;
    }

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }
    
</style>

<body style="background-color: #CCCCCC">
    <div align="center">
        <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}">
            <tbody>
                <tr>
                    <td style="padding: 70px">
                        <div align="center">
                            <p align="right">
                                <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" height="133" border="0"
                                    width="100%" style="text-align: center">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:left">
                                                <div align="center">
                                                    <table cellspacing="0" cellpadding="0" height="74" border="0"
                                                        width="850">
                                                        <tbody>
                                                            <tr>
                                                                <td valign="top"></td>
                                                            </tr>
                                                            <tr>
                                                                <td valign="top">
                                                                    <table cellspacing="0" cellpadding="0" border="0"
                                                                        width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td width="105">
                                                                                    <p align="left">
                                                                                        @if(stripos(\Request::url(),
                                                                                        'localhost') !== FALSE)
                                                                                        <img src="{{ asset('img/WhatsApp Image 2022-06-10 at 10.59.25.jpeg') }}"
                                                                                            style="width: 120px"
                                                                                            border="0">
                                                                                        @else
                                                                                        <img src="{{ asset('service/img/WhatsApp Image 2022-06-10 at 10.59.25.jpeg') }}"
                                                                                            style="width: 120px"
                                                                                            border="0">
                                                                                        @endif

                                                                                    </p>
                                                                                </td>

                                                                                <td align="center">
                                                                                    <font style="font-size: 15pt"
                                                                                        color="#000000">PEMERINTAH
                                                                                        DAERAH DAERAH ISTIMEWA
                                                                                        YOGYAKARTA</font>
                                                                                    <br>
                                                                                    <font style="font-size: 18pt"
                                                                                        color="#000000">DINAS KESEHATAN
                                                                                    </font><br>
                                                                                    <font style="font-size: 17pt"
                                                                                        color="#000000">RUMAH SAKIT JIWA
                                                                                        GRHASIA</font>
                                                                                    <br>
                                                                                    @if(stripos(\Request::url(),
                                                                                    'localhost') !== FALSE)
                                                                                    <img src="{{ asset('img/Aksara Jawa_Surat.png') }}"
                                                                                        width="300" border="0">
                                                                                    @else
                                                                                    <img src="{{ asset('service/img/Aksara Jawa_Surat.png') }}"
                                                                                        width="300" border="0">
                                                                                    @endif
                                                                                    <br>
                                                                                    <font style="font-size: 17pt"
                                                                                        color="#000000">KLINIK PSIKOLOGI
                                                                                    </font>
                                                                                    <br>
                                                                                    <font color="#000000"
                                                                                        style="font-size: 12pt">
                                                                                        Jl. Kaliurang KM 17 Yogyakarta
                                                                                        Telepon (0274) 895143, 895297
                                                                                        Facsimile (0274) 895142
                                                                                        <br>Website :
                                                                                        grhasia.jogjaprov.go.id Email :
                                                                                        grhasiamentalhospital@jogjaprov.go.id
                                                                                        Kode Pos 55582

                                                                                    </font>
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
                                                <div style="margin-top: -10px">
                                                    <hr
                                                        style="border:1px solid #000;margin-bottom:0px;border-style: solid">
                                                    <hr style="border:0.5px solid #000;margin-top:2px">
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                                @foreach ($data as $d)
                                    <table cellspacing="0" style="line-height: 25px;" cellpadding="0" bgcolor="#FFFFFF" height="0" border="0"
                                    width="100%">
                                    <tr>
                                        <td><br>
                                            Nomor RM
                                        </td>
                                        <td>:</td>
                                        <td>{{$d->norm}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Nama Pasien
                                        </td>
                                        <td>:</td>
                                        <td>{{$d->nama}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Tgl Lahir
                                        </td>
                                        <td>:</td>
                                        <td>{{$d->tgllahir}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Alamat Pasien
                                        </td>
                                        <td>:</td>
                                        <td>{{$d->alamat}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Tgl Kunjungan
                                        </td>
                                        <td>:</td>
                                        <td>{{$d->tglpemeriksaan}}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <br>
                                            <hr style="border:0.5px solid #000;margin-top:2px">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="text-align: center"><b><u>HASIL PEMERIKSAAN PSIKOLOGIS</u></b></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="text-align: center">Nomor : 499 / {{$d->nomor}} <br><br></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <table border="1" align="center" width="100%" style="border: 1px solid black;border-collapse: collapse;">
                                                <tr>
                                                    <th rowspan="2" colspan="2">ASPEK</th>
                                                    <th colspan="5">NILAI</th>
                                                    <th rowspan="2">KETERANGAN</th>
                                                </tr>
                                                <tr>
                                                    <th>1</th>
                                                    <th>2</th>
                                                    <th>3</th>
                                                    <th>4</th>
                                                    <th>5</th>
                                                </tr>
                                                <tr>
                                                    <th rowspan="3">INTELEGENSIA</th>
                                                    <td>Inteligensia Umum</td>
                                                    <td>{{$d->iu1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->iu2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->iu3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->iu4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->iu5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->iuket}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Daya Tangkap</td>
                                                    <td>{{$d->dt1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->dt2== 1 ? "√": " "}}</td>
                                                    <td>{{$d->dt3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->dt4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->dt5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->dtket}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Logika Berpikir</td>
                                                    <td>{{$d->lb1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->lb2== 1 ? "√": " "}}</td>
                                                    <td>{{$d->lb3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->lb4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->lb5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->lbket}}</td>
                                                </tr>
                                                
                                                <tr>
                                                    <th rowspan="4">KEMAMPUAN BEKERJA</th>
                                                    <td>Sistematika Kerja</td>
                                                    <td>{{$d->sk1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->sk2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->sk3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->sk4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->sk5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->skket}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kerja dibawah Tekanan</td>
                                                    <td>{{$d->kdt1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kdt2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kdt3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kdt4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kdt5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kdtket}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Tempo Kerja</td>
                                                    <td>{{$d->tk1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->tk2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->tk3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->tk4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->tk5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->tkket}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Ketelitian</td>
                                                    <td>{{$d->ke1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->ke2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->ke3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->ke4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->ke5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->keket}}</td>
                                                </tr>

                                                <tr>
                                                    <th rowspan="4">KEPRIBADIAN</th>
                                                    <td>Stabilitas Emosi</td>
                                                    <td>{{$d->se1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->se2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->se3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->se4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->se5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->seket}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kepercayaan Diri</td>
                                                    <td>{{$d->kd1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kd2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kd3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kd4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kd5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kdket}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kerjasama</td>
                                                    <td>{{$d->ker1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->ker2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->ker3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->ker4== 1 ? "√": " "}}</td>
                                                    <td>{{$d->ker5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->kerket}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Penyesuaian Diri</td>
                                                    <td>{{$d->pd1 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->pd2 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->pd3 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->pd4 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->pd5 == 1 ? "√": " "}}</td>
                                                    <td>{{$d->pdket}}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="8"><i>Keterangan Nilai : <br>
                                                    1 = Kurang, 2 = Dibawah Rat-rata, 3 = Sedang, 4 = Diatas Rata-rata, 5 = Baik</i></td>
                                                </tr>
                                                <tr>
                                                    <td colspan="8"><b>SARAN</b><br>
                                                    {{$d->saran}}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        {{-- <td colspan="2"></td> --}}
                                        <td style="text-align: center; padding-left: 500px" colspan="3"><br><br> Yogyakarta, {{$d->tanggal}} <br>Pskolog, <br><br><br><br>
                                        <u>{{substr($d->pemeriksa,strpos($d->pemeriksa, "~")+1)}}</u><br>
                                        NIP/SIPPK {{$d->nip}}</td>
                                    </tr>

                                </table>
                                @endforeach
                                
                                
                            </p>
                        </div>
                    </td>

                </tr>

            </tbody>
        </table>
    </div>
</body>

</html>
