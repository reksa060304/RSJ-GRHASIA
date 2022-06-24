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
                                <table cellspacing="0" style="line-height: 25px" cellpadding="0" bgcolor="#FFFFFF" height="0" border="0"
                                    width="100%">
                                    <tr>
                                        <td><br>
                                            Nomor RM
                                        </td>
                                        <td>:</td>
                                        <td>{{$res['d'][0]->value}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Nama Pasien
                                        </td>
                                        <td>:</td>
                                        <td>{{$res['d'][1]->value}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Tgl Lahir
                                        </td>
                                        <td>:</td>
                                        <td>{{$res['d'][2]->value}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Alamat Pasien
                                        </td>
                                        <td>:</td>
                                        <td>{{$res['d'][3]->value}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Tgl Pemeriksaan
                                        </td>
                                        <td>:</td>
                                        <td>{{$res['d'][4]->value}}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Tujuan Pemeriksaan
                                        </td>
                                        <td>:</td>
                                        <td>{{$res['d'][5]->value}}</td>
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
                                        <td colspan="3" style="text-align: center">Nomor : 499 / {{$res['d'][6]->value}} <br><br></td>
                                    </tr>
                                    <tr>
                                        <td><b>Hasil Observasi</b> <br></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="text-align: justify">{{$res['d'][7]->value}} <br><br></td>
                                    </tr>
                                    <tr>
                                        <td><b>Hasil Tes</b> <br></td>
                                        
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="white-space: nowrap;"> Berdasarkan hasil  <i>Culture Fair Intelligence Test</i> (CFIT) yang diberikan terhadap Sdr./Sdri.{{$res['d'][8]->value}}, <br> diperoleh hasil sebagai berikut: <br><br></td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: left; padding-left: 500px" colspan="3">Skor IQ : {{$res['d'][9]->value}} <br><br>Kategori : {{$res['d'][10]->value}} <br><br><br><br><br></td>
                                    </tr>
                                    
                                    <tr>
                                        {{-- <td colspan="2"></td> --}}
                                        <td style="text-align: center; padding-left: 500px" colspan="3">Yogyakarta, {{$res['d'][11]->value}} <br>Pskolog, <br><br><br><br>
                                        <u>{{substr($res['d'][12]->value,strpos($res['d'][12]->value, "~")+1)}}</u><br>
                                    NIP/SIPPK {{$res['d'][13]->value}}</td>
                                    </tr>
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
