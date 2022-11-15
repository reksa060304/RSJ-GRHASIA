<!DOCTYPE html >
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Persetujuan Umum</title>
       @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.qr-code.js') }}"></script>

 
        <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        <!-- angular -->
        <script src="{{ asset('js/angular/angular.min.js') }}" type="text/javascript"></script>
        <script src="{{ asset('js/angular/angular-route.min.js') }}" type="text/javascript"></script>
        <script type="text/javascript" src="{{ asset('js/angular/angular-animate.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/angular/angular-aria.min.js') }}"></script>
        <script src="{{ asset('js/angular/angular-material.js') }}" type="text/javascript"></script>
    @else
      <link rel="stylesheet" href="{{ asset('service/css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/tabel.css') }}">
    <script src="{{ asset('service/js/jquery.min.js') }}"></script>
    <script src="{{ asset('service/js/jquery.qr-code.js') }}"></script>

        <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
        <!-- angular -->
        <script src="{{ asset('service/js/angular/angular.min.js') }}" type="text/javascript"></script>
        <script src="{{ asset('service/js/angular/angular-route.min.js') }}" type="text/javascript"></script>
        <script type="text/javascript" src="{{ asset('service/js/angular/angular-animate.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('service/js/angular/angular-aria.min.js') }}"></script>
        <script src="{{ asset('service/js/angular/angular-material.js') }}" type="text/javascript"></script>
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

<body class="A4" style="font-family:Tahoma;height: auto">
    <section class="sheet padding-10mm" style="font-family:Tahoma">

                {{-- <table cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                               <img src="{{ asset('img/logo_only.png') }}" alt="" style="width: 90px;">
                            @else
                              <img src="{{ asset('service/img/logo_only.png') }}" alt="" style="width: 90px;">
                            @endif
                          
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
                                        <td class="f-s-15 bold text-top"><b>{{  $data[0]->nocm  }}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Nama</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{{  $data[0]->namapasien  }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Jenis Kelamin</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{{  $data[0]->jeniskelamin   }}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Tgl Lahir</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{{ date('d-m-Y',strtotime( $data[0]->tgllahir  )) }}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Ruangan</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{{  $data[0]->namaruangan   }}</b>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table> --}}
            
        <table width="100%" border="0" bordercolor="#000000" class="garis1" style="margin-left: 2px; font-family: Arial">
            <tr>
                <td colspan="2" style="font-weight: bold; font-size: 14pt; text-align: center; font-family: Arial">
                    FORMULIR PEMBERIAN INFORMASI DAN PERSETUJUAN UMUM <br>
                    <i>(GENERAL CONSENT)</i> UNTUK MENERIMA PELAYANAN KESEHATAN

                </td>
            </tr>
            <tr>
                <td style="font-family: Arial" colspan="2">Dengan ini menyatakan dengan sesungguhnya bahwa :</td>
            </tr>
            <tr>
                <td valign="top">1.</td>
                <td style="text-align: justify;font-family: Arial"><b>HAK DAN KEWAJIBAN SEBAGAI PASIEN. </b>Dengan menandatangani dokumen ini, Saya mengakui sudah mendapat informasi
                    tentang Hak dan Kewajiban Pasien serta Peraturan yang berlaku di Rumah Sakit Jiwa Grhasia yang diberikan oleh petugas Rumah
                    Sakit dan saya telah memahami, menerima dan menyetujuinya.
                </td>
            </tr>
            <tr>
                <td valign="top">2.</td>
                <td style="text-align: justify;font-family: Arial"><b>PERSETUJUAN PELAYANAN KESEHATAN. </b>Saya menyetujui dan memberikan persetujuan untuk dirawat di Rumah Sakit Jiwa
                Grhasia dan dengan ini saya meminta dan memberikan kuasa kepada Rumah Sakit Jiwa Grhasia, Dokter, Perawat dan Petugas
                Kesehatan lainnya di Rumah Sakit Jiwa Grhasia untuk memberikan asuhan medis dan keperawatan, termasuk dilakukannya
                tindakan atau prosedur diagnostik seperti pemeriksaan radiologi, EKG, EEG, pengambilan darah untuk pemeriksaan laboratorium,
                pemberian dan atau penyuntikan produk farmasi dan obat-obatan, serta pemasangan alat kesehatan ( kecuali yang membutuhkan
                persetujuan khusus).
                </td>
            </tr>
            <tr>
                <td valign="top">3.</td>
                <td style="text-align: justify;font-family: Arial"><b>AKSES INFORMASI KESEHATAN. </b> Saya memberi kuasa kepada setiap dan seluruh petugas kesehatan yang merawat pasien
                untuk memeriksa dan atau memberitahukan informasi kesehatan pasien serta melakukan konsul kepada pemberi kesehatan lain
                yang dirasa perlu dalam melakukan perawatan pasien dan saya menyetujui atau menerima diagnosis, terapi dan segala tindakan
                medis yang dilakukan dalam rangka upaya penyembuhan.
                </td>
            </tr>
            <tr>
                <td valign="top">4.</td>
                <td style="text-align: justify;font-family: Arial"><b>RAHASIA MEDIS. </b> Saya menyetujui dan memberi kuasa kepada Rumah Sakit Jiwa Grhasia untuk menjaga privasi dan kerahasiaan
                penyakit pasien selama dalam masa perawatannya serta menjamin kerahasiaan informasi medis pasien untuk kepentingan
                perawatan, pengobatan, pendidikan maupun penelitian dan saya menyetujui pelepasan informasi medis sesuai dengan Permenkes
                269 Tahun 2008 Pasal 10 Tentang Rekam Medis ( kepentingan kesehatan pasien, penegakan hukum, penelitian, pendidikan dan
                audit medis ) dan keperluan klaim asuransi.
                </td>
            </tr>
            @foreach ($data as $d)
            <tr>
                <td></td>
                <td style="text-align: justify;font-family: Arial"><b>KERAHASIAAN INFORMASI. </b>  Saya memberi kuasa kepada Rumah Sakit Jiwa Grhasia untuk memberikan informasi tentang
                    diagnosis, hasil pelayanan dan pengobatan saya selama dirawat kepada ( tulis nama ) : <br>
                    <ol type="a">
                        <li>{{$d->kerahasiaan1}}</li>
                        <li>{{$d->kerahasiaan2}}</li>
                        <li>{{$d->kerahasiaan3}}</li>
                        <li>{{$d->kerahasiaan4}}</li>
                    </ol>
                </td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: justify;font-family: Arial"><b>PRIVASI. </b>  Saya memberi kuasa kepada Rumah Sakit Jiwa Grhasia untuk menjaga privasi dan kerahasiaan penyakit saya selama
                dalam perawatan. Saya 
                @if ($d->ismengizinkan == true)
                    menginginkan / <s>tidak menginginkan</s>
                @else
                    <s>menginginkan</s> / tidak menginginkan
                @endif privasi khusus pada saat :
                <br>
                    <ol type="a">
                        <li>{{$d->privasi1}}</li>
                        <li>{{$d->privasi2}}</li>
                        <li>{{$d->privasi3}}</li>
                        <li>{{$d->privasi4}}</li>
                    </ol>
                </td>
            </tr>
            @endforeach
            <tr>
                <td valign="top">5.</td>
                <td style="text-align: justify;font-family: Arial"><b>RUMAH SAKIT LAYANAN PENDIDIKAN. </b> Saya mengetahui bahwa Rumah Sakit Jiwa Grhasia merupakan Rumah Sakit yang
                digunakan untuk pendidikan dan praktik klinik mahasiswa kedokteran dan profesi kesehatan lainnya. Untuk itu, saya menyetujui
                mereka berpartisipasi dalam perawatan pasien sepanjang dibawah supervisi Penanggung Jawab Pasien yaitu dokter, perawat dan
                tenaga kesehatan lain. Hal ini dikecualikan bagi pasien kelas VIP.
                </td>
            </tr>
            <tr>
                <td valign="top">6.</td>
                <td style="text-align: justify;font-family: Arial"><b>BARANG PRIBADI. </b>  Saya memahami dan akan memenuhi peraturan untuk tidak membawa barang berharga yang tidak diperlukan
                (perhiasan, elektronik, dll) dan jika terjadi kehilangan, pencurian atau kerusakan maka Rumah Sakit Jiwa Grhasia tidak bertanggung
                jawab terhadap hal tersebut.
                </td>
            </tr>
            <tr>
                <td valign="top">7.</td>
                <td style="text-align: justify;font-family: Arial"><b>PENGAJUAN KELUHAN. </b> Saya menyatakan bahwa telah menerima informasi tentang adanya tata cara mengajukan dan mengatasi
                keluhan terkait pelayanan medik yang diberikan terhadap diri saya. Saya setuju untuk mengikuti tata cara mengajukan keluhan
                sesuai prosedur yang ada.
                </td>
            </tr>
            <tr>
                <td valign="top">8.</td>
                <td style="text-align: justify;font-family: Arial">Saya menyetujui untuk melunasi seluruh biaya perawatan, obat - obatan dan tindakan lain ( sesuai jenis cara bayarnya ) maupun
                    selisih biaya jaminan kesehatan serta sanggup menerima kembali setelah pasien dapat dipulangkan dalam waktu secepatnya.
                </td>
            </tr>
            <tr>
                <td valign="top">9.</td>
                <td style="text-align: justify;font-family: Arial">Melalui dokumen ini, saya menegaskan kembali bahwa saya mempercayakan kepada semua Tenaga Kesehatan Rumah Sakit Jiwa
                Grhasia untuk memberikan perawatan, diagnostik dan terapi kepada pasien Rawat Inap / Rawat Jalan / IGD, semua pemeriksaan
                penunjang yang dibutuhkan untuk pengobatan dan tindakan yang aman.
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: justify;font-family: Arial; padding-top: 10px">
                    Dengan ini saya menyatakan bahwa saya telah menerima dan memahami informasi sebagaimana diatas dan menyetujuinya.
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    @foreach ($data as $dd)
                        <table width="100%" style="margin-top: 30px">
                        <tr>
                            <td colspan="3" style="text-align: right;font-family: Arial; ">Yogyakarta, {{$dd->tglnow}} Pukul {{$dd->waktu}} WIB</td>
                        </tr>
                        <tr>
                            <td style="text-align: center;font-family: Arial">Penanggung Jawab Pasien</td>
                            <td style="text-align: center;font-family: Arial">Petugas Pemberi Informasi</td>
                            <td style="text-align: center;font-family: Arial">Saksi</td>
                        </tr>
                        <tr>
                            <td height="80px"></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style="text-align: center;font-family: Arial">{{$dd->penanggungjawab}}</td>
                            <td style="text-align: center;font-family: Arial">{{$dd->namalengkap}}</td>
                            <td style="text-align: center;font-family: Arial">{{$dd->saksi}}</td>
                        </tr>
                        
                    </table>
                    @endforeach
                </td>
            </tr>
        </table>
                {{-- <div class="footer">
                    <table>
                        <tbody>
                        <tr>
                            <td width="33%" style="text-align: center">
                                
                            </td>

                            <td width="33%"></td>
                            <td width="33%"><b>Yogyakarta</b>, {!! date('d-m-Y') !!} <br>
                                <b>Dokter Penanggung Jawab</b></td>
                        </tr>
                        <tr>
                            <td>
                            </td>
                            <td></td>
                            <td height="90px">
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: center">
                            
                            </td>
                            <td style="text-align: center">&nbsp;</td>
                            <td style="text-align: center"><span style="font-weight: bold;color: #ccc">Ditandatangani secara elektronik</span>
                                <br>{!! $res['d'][0]->namadokter !!}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div> --}}

    </section>
</body>
<style>
    .footer {
        text-align: center;
        position: absolute;
        bottom: 8%;
        right: 10%;
     }
    </style>

</body>

</html>
