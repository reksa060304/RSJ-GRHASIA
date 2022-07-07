<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report HPP Minat Bakat</title>
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    <!-- angular -->
    <script src="{{ asset('js/angular/angular.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('js/angular/angular-route.min.js') }}" type="text/javascript"></script>
    <script type="text/javascript" src="{{ asset('js/angular/angular-animate.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/angular/angular-aria.min.js') }}"></script>
    <script src="{{ asset('js/angular/angular-material.js') }}" type="text/javascript"></script>
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.qr-code.js') }}"></script>
    @else

    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('service/css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/tabel.css') }}">
    <!-- angular -->
    <script src="{{ asset('service/js/angular/angular.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('service/js/angular/angular-route.min.js') }}" type="text/javascript"></script>
    <script type="text/javascript" src="{{ asset('service/js/angular/angular-animate.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('service/js/angular/angular-aria.min.js') }}"></script>
    <script src="{{ asset('service/js/angular/angular-material.js') }}" type="text/javascript"></script>
    <script src="{{ asset('service/js/jquery.min.js') }}"></script>
    <script src="{{ asset('service/js/jquery.qr-code.js') }}"></script>
    @endif
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

        table {
            /* width: 100%;
            height: 100%; */
        }
    </style>
</head>

<body class="A4" style="font-family:Arial;height: auto">
    <section class="sheet padding-15mm" style="font-family:Arial">

        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/WhatsApp Image 2022-06-10 at 10.59.25.jpeg') }}" alt=""
                            style="width: 90px;">
                        @else
                        <img src="{{ asset('service/img/WhatsApp Image 2022-06-10 at 10.59.25.jpeg') }}" alt=""
                            style="width: 90px;">
                        @endif

                    </td>
                    <td style="text-align: center">

                        <span style="font-size: 12pt">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</span></br>
                        <span style="font-size: 16pt;">DINAS KESEHATAN</span><br>
                        <span style="font-size: 14pt;">RUMAH SAKIT JIWA GRHASIA</span><br>
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/Aksara Jawa_Surat.png') }}" alt="" style="width: 170px;">
                        @else
                        <img src="{{ asset('service/img/Aksara Jawa_Surat.png') }}" alt="" style="width: 170px;">
                        @endif <br>
                        <span style="font-size: 14pt" color="#000000">KLINIK PSIKOLOGI
                        </span>
                        <br>
                        <span color="#000000" style="font-size: 10pt">
                            Jl. Kaliurang KM 17 Yogyakarta
                            Telepon (0274) 895143, 895297
                            Facsimile (0274) 895142
                            <br>Website :
                            grhasia.jogjaprov.go.id Email :
                            grhasiamentalhospital@jogjaprov.go.id
                            Kode Pos 55582
                        </span>
                    </td>
                    {{-- <td width="50%" style="padding: 10px">
                        <div class="box" style="text-align: left">
                            <table style="padding: 3px;">
                                <tr>
                                    <td class="f-s-15 bold  text-top" style="width: 100px">No. RM</td>
                                    <td class="f-s-15 bold  text-top">:</td>
                                    <td class="f-s-15 bold text-top"><b>{!! $res['d'][0]->nocm !!}</b></td>
                                </tr>
                                <tr>
                                    <td class="f-s-15 bold  text-top">Nama</td>
                                    <td class="f-s-15 bold  text-top">:</td>
                                    <td class="f-s-15 bold  text-top"><b>{!! $res['d'][0]->namapasien !!}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="f-s-15 bold  text-top">Jenis Kelamin</td>
                                    <td class="f-s-15 bold  text-top">:</td>
                                    <td class="f-s-15 bold  text-top">
                                        <b>{!! $res['d'][0]->jeniskelamin !!}</b></td>
                                </tr>
                                <tr>
                                    <td class="f-s-15 bold  text-top">Tgl Lahir</td>
                                    <td class="f-s-15 bold  text-top">:</td>
                                    <td class="f-s-15 bold  text-top">
                                        <b>{!! date('d-m-Y',strtotime( $res['d'][0]->tgllahir )) !!}</b></td>
                                </tr>
                                <tr>
                                    <td class="f-s-15 bold  text-top">Ruangan</td>
                                    <td class="f-s-15 bold  text-top">:</td>
                                    <td class="f-s-15 bold  text-top"><b>{!! $res['d'][0]->namaruangan !!}</b>
                                    </td>
                                </tr>
                            </table> 
                        </div>
                    </td> --}}
                </tr>
            </tbody>
        </table>

        <hr style="border:1px solid #000;margin-bottom:0px">
        <hr style="border:0.5px solid #000;margin-top:2px">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td>
                    <table width="100%">
                        <tr>
                            <td><br>
                                Nomor RM
                            </td>
                            <td>:</td>
                            <td>{{$detail[0]['value']}}</td>
                        </tr>
                        <tr>
                            <td>
                                Nama Pasien
                            </td>
                            <td>:</td>
                            <td>{{$detail[1]['value']}}</td>
                        </tr>
                        <tr>
                            <td>
                                Tgl Lahir
                            </td>
                            <td>:</td>
                            <td>{{$detail[2]['value']}}</td>
                        </tr>
                        <tr>
                            <td>
                                Alamat Pasien
                            </td>
                            <td>:</td>
                            <td>{{$detail[3]['value']}}</td>
                        </tr>
                        <tr>
                            <td>
                                Tgl Kunjungan
                            </td>
                            <td>:</td>
                            <td>{{$detail[4]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <br>
                                <hr style="border:0.5px solid #000;margin-top:2px">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <table cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td colspan="3" style="text-align: center"><b><u>HASIL PEMERIKSAAN PSIKOLOGIS</u></b></td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center">Nomor : 499 / {{$detail[6]['value']}} <br><br></td>
            </tr>
            <tr>
                <td><b>I. PSIKOGRAM</b></td>
            </tr>
            <tr>
                <td colspan="3">
                    <table border="1" align="center" width="100%"
                        style="border: 3px solid black;border-collapse: collapse;line-height: 20px;">
                        <tr>
                            <th rowspan="2">ASPEK PSIKOLOGI</th>
                            <th rowspan="2">DEFINISI ASPEK</th>
                            <th colspan="5">RATING</th>
                        </tr>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                        </tr>
                        <tr>
                            <th>INTELEGENSIA</th>
                            <td>Potensi kecerdasan secara menyeluruh</td>
                            <td>{{$detail[7]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[8]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[9]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[10]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[11]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <th>SISTEMATIKA BERPIKIR</th>
                            <td>Kemampuan berpikir logis, mandiri, dan praktis</td>
                            <td>{{$detail[12]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[13]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[14]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[15]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[16]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <th>PENGERTIAN BAHASA</th>
                            <td>Kemampuan memahami bahasa, berpikir verbal dan kemampuan empati</td>
                            <td>{{$detail[17]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[18]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[19]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[20]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[21]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <th>DAYA ANALISA</th>
                            <td>Kemampuan untuk melihat suatu hubungan, mengkombinasikan, dan fleksibilitas dalam
                                berpikir</td>
                            <td>{{$detail[22]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[23]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[24]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[25]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[26]['value'] == 1 ? "√": " "}}</td>
                        </tr>

                        <tr>
                            <th>ABTRAKSI VERBAL</th>
                            <td>Kemampuan untuk berpikir logis dalam bentuk bahasa</td>
                            <td>{{$detail[27]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[28]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[29]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[30]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[31]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <th>MEMORI</th>
                            <td>Kemampuan untuk mengingat kembali hal yang telah dipelajari</td>
                            <td>{{$detail[32]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[33]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[34]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[35]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[36]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <th>BERHITUNG PRAKTIS</th>
                            <td>Kemampuan berpikir praktis dalam berhitung</td>
                            <td>{{$detail[37]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[38]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[39]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[40]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[41]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <th>BERHITUNG TEORETIS</th>
                            <td>Kemampuan berpikir teoretis dalam berhitung</td>
                            <td>{{$detail[42]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[43]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[44]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[45]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[46]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <th>DAYA ABSTRAKSI</th>
                            <td>Kemampuan mengamati, membayangkan, dan mengenali komponen konstruktif</td>
                            <td>{{$detail[47]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[48]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[49]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[50]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[51]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <th>ABTRAKSI RUANG BIDANG</th>
                            <td>Kemampuan berpikir analitis dalam hal ruang bidang</td>
                            <td>{{$detail[52]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[53]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[54]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[55]['value'] == 1 ? "√": " "}}</td>
                            <td>{{$detail[56]['value'] == 1 ? "√": " "}}</td>
                        </tr>
                        <tr>
                            <td colspan="7"><i>Keterangan Nilai : <br>
                                    1 = Sangat Kurang, 2 = Kurang, 3 = Cukup, 4 = Baik, 5 = Sangat Baik</i></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>



    </section>

    <section class="sheet padding-15mm" style="font-family:Arial">

        <table border="1" align="center" width="100%"
            style="border: 3px solid black;border-collapse: collapse;line-height: 25px">
            <tr>
                <th rowspan="2">ASPEK PSIKOLOGI</th>
                <th rowspan="2">DEFINISI ASPEK</th>
                <th colspan="5">RATING</th>
            </tr>
            <tr>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
            </tr>
            <tr>
                <td>Berprestasi</td>
                <td>Menetapkan target yang tinggi</td>
                <td>{{$detail[57]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[58]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[59]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[60]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[61]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Meminta pendapat orang lain </td>
                <td>Butuh pendapat orang lain untuk mengambil keputusan </td>
                <td>{{$detail[62]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[63]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[64]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[65]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[66]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Teratur</th>
                <td>Melakukan tugas secara sistematis</td>
                <td>{{$detail[67]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[68]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[69]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[70]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[71]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Tampil</td>
                <td>Mendapat pengakuan dan penghargaan dari orang lain</td>
                <td>{{$detail[72]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[73]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[74]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[75]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[76]['value'] == 1 ? "√": " "}}</td>
            </tr>

            <tr>
                <td>Mandiri </td>
                <td>Mengambil keputusan secara mandiri</td>
                <td>{{$detail[77]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[78]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[79]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[80]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[81]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Berteman</td>
                <td>Mengenal dan bersosialisasi dengan orang lain</td>
                <td>{{$detail[82]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[83]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[84]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[85]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[86]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Memahami orang lain</td>
                <td>Mengenali emosi orang lain</td>
                <td>{{$detail[87]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[88]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[89]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[90]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[91]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Didukung orang lain</td>
                <td>Mendapat dukungan dari orang lain</td>
                <td>{{$detail[92]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[93]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[94]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[95]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[96]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Memimpin</td>
                <td>Mengambil peran dalam kelompok</td>
                <td>{{$detail[97]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[98]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[99]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[100]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[101]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Merasa bersalah</td>
                <td>Mengambil tanggung jawab terhadap suatu kesalahan</td>
                <td>{{$detail[102]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[103]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[104]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[105]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[106]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Mengayomi</td>
                <td>Memperhatikan dan memenuhi kebutuhan orang lain</td>
                <td>{{$detail[107]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[108]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[109]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[110]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[111]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Melakukan perubahan</td>
                <td>Melakukan perbaikan dan perubahan</td>
                <td>{{$detail[112]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[113]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[114]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[115]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[116]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Ketekunan</td>
                <td>Tidak mudah putus asa dalam berusaha</td>
                <td>{{$detail[117]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[118]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[119]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[120]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[121]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Ketertarikan pada lawan jenis</th>
                <td>Mengenal dan bersosialisasi secara nyaman dengan lawan jenis</td>
                <td>{{$detail[122]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[123]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[124]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[125]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[126]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Bertindak agresif</td>
                <td>Keberanian untuk mengambil tindakan yang tegas pada orang lain</td>
                <td>{{$detail[127]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[128]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[129]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[130]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[131]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Kecepatan Kerja</td>
                <td>Kecepatan dalam menyelesaikan suatu tugas yang dibatasi oleh waktu</td>
                <td>{{$detail[132]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[133]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[134]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[135]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[136]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Ketelitian Kerja</th>
                <td>Ketelitian dalam menyelesaikan suatu tugas yang dibatasi oleh waktu</td>
                <td>{{$detail[137]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[138]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[139]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[140]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[141]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Ketahanan Kerja</td>
                <td>Keuletan menyelesaikan masalah rumit dan ambigu, dalam waktu yang terbatas</td>
                <td>{{$detail[142]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[143]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[144]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[145]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[146]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td>Keajegan Kerja</th>
                <td>Kestabilan dalam menyelesaikan suatu tugas yang dibatasi waktu</td>
                <td>{{$detail[147]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[148]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[149]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[150]['value'] == 1 ? "√": " "}}</td>
                <td>{{$detail[151]['value'] == 1 ? "√": " "}}</td>
            </tr>
            <tr>
                <td colspan="7"><i>Keterangan Nilai : <br>
                        1 = Sangat Rendah, 2 = Rendah, 3 = Rata-rata, 4 = Baik/Tinggi, 5 = Sangat Baik/Sangat Tinggi</i>
                </td>
            </tr>
        </table>
    </section>

    <section class="sheet padding-15mm" style="font-family:Arial;  ">
        <table cellspacing="0" cellpadding="0"align="center" border="0" width="100%" style="border-collapse: collapse">
            <tbody>
                <tr>
                <td><b>II. DESKRIPSI</b></td>
            </tr>
            <tr>
                <td>
                    - Aspek Kecerdasan
                </td>
            </tr>
            <tr>
                <td>
                    <table cellspacing="0" cellpadding="0" border="0" >
                        <tr>
                            <td>
                                <ul>
                                    <li>Kapasitas kecerdasan tergolong cukup baik IQ: {{$detail[152]['value']}} dengan
                                        skala
                                        IST</li>
                                    <li>Aspek yang cenderung menonjol adalah {{$detail[153]['value']}}</li>
                                    <li>Corak berpikir cenderung @if ($detail[154]['value']==1)Eksak @else <s>Eksak</s>
                                        @endif /
                                        @if ($detail[155]['value']==1)Non Eksak @else <s>Non Eksak</s> @endif</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: justify">
                                Secara umum, potensi kecerdasannya tergolong @if ($detail[156]['value']==1)Memadai @else
                                <s>Memadai</s> @endif /
                                @if ($detail[157]['value']==1)Tidak Memadai @else <s>Tidak Memadai</s> @endif untuk
                                menempuh studi lanjut maupun berkarir selanjutnya.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                - Aspek Kepribadian dan Sosial <br>
                            </td>
                        </tr>
                        <tr>
                            <td >
                                <ul style="text-align: justify">
                                    <li >
                                        {{$detail[158]['value']}}</li>
                                </ul>
                            </td>
                            
                        </tr>
                        <tr>
                            <td>- Aspek Minat
                            </td>
                        </tr>
                        <tr>
                            <td >
                                <ul style="text-align: justify">
                                    <li >{{$detail[159]['value']}}</li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            </tbody>
        </table>
        <br>
        <table cellspacing="0" cellpadding="0"align="center" border="0" width="100%" style="border-collapse: collapse">
            <tr>
                <td colspan="2"><b>V. REKOMENDASI</b></td>
            </tr>
            <tr>
                <td>1. Disarankan </td>
                <td>: {{$detail[160]['value']}}</td>
            </tr>
            <tr>
                <td>2. Dipertimbangkan </td>
                <td>: {{$detail[161]['value']}}</td>
            </tr>
            <tr>
                <td>3. Kurang Disarankan </td>
                <td>: {{$detail[162]['value']}}</td>
            </tr>
        </table>
        <br><br>
        <table cellspacing="0" cellpadding="0"align="center" border="0" width="100%" style="border-collapse: collapse">
            <tr>
                <td style="text-align: center; padding-left: 500px" colspan="3"><br><br> Yogyakarta,
                    {{$detail[163]['value']}} <br>Pskolog, <br><br><br><br>
                    <u>{{substr($detail[164]['value'],strpos($detail[164]['value'], "~")+1)}}</u><br>
                    NIP/SIPPK {{$detail[165]['value']}}</td>
            </tr>
        </table>
    </section>
</body>
<style>
    .footer {
        position: absolute;
        bottom: 5%;
        right: 5%;
    }
</style>
</body>

</html>
