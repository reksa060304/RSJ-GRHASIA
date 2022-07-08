<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>General Consent</title>
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
    <section class="sheet padding-10mm" style="font-family:Arial">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/logo_only.png') }}" alt=""
                            style="width: 85px;">
                            
                        @else
                        <img src="{{ asset('service/img/logo_only.png') }}" alt=""
                            style="width: 85px;">
                        @endif
                        <span style="font-size: 9pt;font-weight: bold; line-height: -1px;font-family: Arial">RSJ GRHASIA</span>
                    </td>
                    <td style="text-align: center;font-family: Arial">
                        <span style="font-size: 11pt; font-weight: bold; line-height: -1px">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</span></br>
                        <span style="font-size: 13pt;font-weight: bold; line-height: -1px">DINAS KESEHATAN</span><br>
                        <span style="font-size: 12pt;font-weight: bold; line-height: -1px">RUMAH SAKIT JIWA GRHASIA</span><br>
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/Aksara Jawa_Surat.png') }}" alt="" style="width: 150px;">
                        @else
                        <img src="{{ asset('service/img/Aksara Jawa_Surat.png') }}" alt="" style="width: 150px;">
                        @endif <br>
                        <span color="#000000" style="font-size: 8pt">
                            Jl. Kaliurang KM 17 Yogyakarta
                            Telepon (0274) 895143, 895297
                            Facsimile (0274) 895142
                            <br>Website :
                            grhasia.jogjaprov.go.id Email :
                            grhasiamentalhospital@jogjaprov.go.id <br>
                            Kode Pos 55582
                        </span>
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <hr style="border:1px solid #000;margin-bottom:0px">
        {{-- <hr style="border:0.5px solid #000;margin-top:2px"> --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td colspan="3" style="text-align: center;font-family: Arial; "><b>FORMULIR PEMBERIAN INFORMASI DAN PERSETUJUAN UMUM <br>
                    <i>(GENERAL CONSENT)</i> UNTUK MENERIMA PELAYANAN KESEHATAN</b></td>
            </tr>
            <tr>
                <td colspan="3">
                    <table border="1" align="center" width="100%"
                        style="border: 3px solid black;border-collapse: collapse;line-height: 15px;">
                        <tr>
                            <th colspan="3" style="font-family: Arial; background-color: rgb(157, 148, 148)">PEMBERIAN INFORMASI</th>
                            
                        </tr>
                        <tr>
                            <td colspan="3">Nama Petugas Pemberi Informasi : {{substr($detail[0]['value'],strpos($detail[0]['value'], "~")+1)}}</td>
                        </tr>
                        <tr>
                            <td width="150">Nama Pasien</td>
                            <td colspan="2">{{$detail[1]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Nomor Rekam Medis</td>
                            <td colspan="2">{{$detail[2]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Tempat / Tanggal Lahir</td>
                            <td>{{$detail[3]['value']}}</td>
                            <td width="150">Usia : {{$detail[4]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Jenis Kelamin</td>
                            <td colspan="2">{{$detail[5]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Alamat Pasien</td>
                            <td colspan="2">{{$detail[6]['value']}}</td>
                        </tr>
                        <tr>
                            <td colspan="3">Jika penerima informasi bukan pasien, Lengkapi isian pada kolom di bawah : </td>
                        </tr>
                        <tr>
                            <td>Nama Penerima Informasi</td>
                            <td>{{$detail[7]['value']}}</td>
                            <td>NIK : {{$detail[8]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td colspan="2">{{$detail[9]['value']}}</td>
                        </tr>
                        <tr>
                            <td>Hubungan dengan pasien</td>
                            <td colspan="2">{{$detail[10]['value']}}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table border="0" align="center" width="100%"
                        style="line-height: 15px;">
                        <tr>
                            <td colspan="2" style="font-family: Arial">Dengan ini menyatakan dengan sesungguhnya bahwa :</td>
                        </tr>
                        <tr>
                            <td valign="top">1. </td>
                            <td style="text-align: justify;font-family: Arial"> <b>HAK DAN KEWAJIBAN SEBAGAI PASIEN. </b>Dengan menandatanagani dokumen ini. Saya mengaku sudah mendapat informasi tentang HAK dan Kewajiban Pasien serta Peraturan yang berlaku di 
                                Rumah Sakit Jiwa Grhasia yang diberikan oleh petugas Rumah Sakit dan saya telah memahami, menerima dan menyetujui.</td>
                        </tr>
                        <tr>
                            <td valign="top">2. </td>
                            <td style="text-align: justify;font-family: Arial"><b>PERSETUJUAN PELAYANAN KESEHATAN. </b>Saya menyetujui dan memberikan persetujuan untuk dirawat di Rumah Sakit Jiwa Grhasia dan dengan ini saya meminta dan memberikan kuasa kepada Rumah Sakit Jiwa Grhasia, Dokter, Perawat dan Petugas Kesehatan lainnya di Rumah Sakit Grhasia untuk memberikan asuhan Medis dan keperawatan, termasuk dimasukan tindakan atau prosedur diagnostik seperti pemeriksaaan radiologi, EKG, EEG, dan pengambilan darah untuk pemeriksaan laboratorium, pemberian dan atau 
                                penyuntikan produk farmasi dan obat-obatan, serta pemasangan alat kesehatan (kecuali yang membutuhkan persetujuan khusus).</td>
                        </tr>
                        <tr>
                            <td valign="top">3. </td>
                            <td style="text-align: justify;font-family: Arial"><b>AKSES INFORMASI KESEHATAN. </b>Saya memberikan kuasa kepada setiap dan seluruh petugas kesehatan yang merawat pasien untuk memeriksa dan atau memberitahukan informasi kesehatan pasien serta melakukan konsul kepada pemberi kesehatan lain yang dirasa perlu dalam melakukan perawatan pasien serta melakukan konsul kepada pemberi kesehatan lain yang dirasa perlu dalam melakukan perawatan pasien dan saya menyetujui 
                                atau menerima diagnosis, terapi dan segala tindakan dalam rangka upaya penyembuhan.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">4. </td>
                            <td style="text-align: justify;font-family: Arial"><b>RAHASIA MEDIS. </b> Saya menyetujui dan memberi kuasa kepada Rumah Sakit Jiwa Grhasia untuk menjaga privasi dan kerahasiaan penyakit pasien selama dalam masa perawatannya serta menjamin kerahasiaan informasi medis pasien untuk kepentingan perawatan, pengobatan dan pendidikan maupun penelitian dan saya menyetujui pelepasan informasi medis sesuai dengan Permenkes 269 Tahun 2008 Pasal 10 Tentang Rekam Medis (kepentingan kesehatan pasien, penegakan hukum, penelitian, pendidikan, dan audit medis)
                                dan keperluan klaim informasi.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"> </td>
                            <td style="text-align: justify;font-family: Arial"><b>KERAHASIAAN INFORMASI. </b> Saya memberi kuasa kepada Rumah Sakit Jiwa Grhasia untuk memberikan informasi tentang diagnosis, 
                                hasil pelayanan dan pengobatan saya selama dirawat kepada (tulis nama) :
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"> </td>
                            <td style="text-align: justify;font-family: Arial">a . {{$detail[11]['value']}}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"> </td>
                            <td style="text-align: justify;font-family: Arial">b . {{$detail[12]['value']}}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"> </td>
                            <td style="text-align: justify;font-family: Arial">b . {{$detail[13]['value']}}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"> </td>
                            <td style="text-align: justify;font-family: Arial"><b>PRIVASI. </b> Saya memberi kuasa kepada Rumah Sakit Jiwa Grhasia untuk menjaga 
                                privasi dan kerahasiaan penyakit saya selama dalam perawatan. Saya menginginkan / tidak menginginkan privasi khusus pada saat :
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"> </td>
                            <td style="text-align: justify;font-family: Arial">a . {{$detail[14]['value']}}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"> </td>
                            <td style="text-align: justify;font-family: Arial">b . {{$detail[15]['value']}}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"> </td>
                            <td style="text-align: justify;font-family: Arial">b . {{$detail[16]['value']}}
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">5. </td>
                            <td style="text-align: justify;font-family: Arial"><b>RUMAH SAKIT LAYANAN PENDIDIKAN. </b> Saya mengetahui bahwa Rumah Sakit Jiwa Grhasia merupakan Rumah Sakit yang digunakan untuk pendidikan dan praktik klinik mahasiswa kedokteran dan profesi kesehatan lainnya. Untuk itu, saya menyetujui mereka berpartisipasi dalam perawatan pasien sepanjang dibawah supervisi Penanggung Jawab Pasien yaitu dokter, 
                                perawat, dan tenaga kesehatan lain. Hal ini dikecualikan bagi pasien kelas VIP.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">6. </td>
                            <td style="text-align: justify;font-family: Arial"><b>BARANG PRIBADI. </b> Saya memahami dan akan memenuhi peraturan untuk tidak membawa barang berharga yang tidak diperlukan (perhiasan, elektronik, dll) dan jika terjadi kehilangan, pencurian atau kerusakan 
                                maka Rumah Sakit Jiwa Grhasia tidak bertanggung jawab terhadap hal tersebut.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">7. </td>
                            <td style="text-align: justify;font-family: Arial"><b>PENGAJUAN KELUHAN. </b> Saya menyatakan bahwa telah menerima informasi tentang adanya tata cara mengajukan dan mengatasi keluhan terkait pelayanan medik yang diberikan terhadap diri saya. 
                                Saya setuju untuk mengikuti tata cara mengajukan keluhan sesuai prosedur yang ada.
                            </td>
                        </tr>
                        
                        
                    </table>
                </td>
            </tr>
        </table>
    </section>
    <section class="sheet padding-10mm" style="font-family:Arial">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td>
                    <table border="0" align="center" width="100%"
                        style="line-height: 15px;">
                        
                        <tr>
                            <td valign="top">8. </td>
                            <td style="text-align: justify;font-family: Arial">Saya menyetujui untuk melunasi seluruh biaya perawatan, obat obatan dan tindakan lain (sesuai jenis cara bayarnya) maupun selisih biaya jaminan 
                                kesehatan serta sanggup menerima kembali setelah pasien dapat dipulangakan dalam waktu secepatnya.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">9. </td>
                            <td style="text-align: justify;font-family: Arial">Melalui dokumen ini, saya menegaskan kembali bahwa saya mempercayakan kepada semua Tenaga Kesehatan Rumah Sakit Jiwa Grhasia untuk memberikan perawatan, diagnostikdan terapi 
                                kepada pasien Rawat Inap / Rawat Jalan / IGD, semua pemeriksaan penjang yang dibutuhkan untuk pengobatan dan tindakan yang aman.
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: center;font-family: Arial;font-size: 12pt;" height="40"><b>HAK PASIEN </b>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">1. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak menerima informasi mengenai tata tertib dan peraturan yang berlaku di Rumah Sakit.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">2. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak memperoleh informasi tentang hak dan kewajiban pasien.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">3. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak memperoleh layanan yang manusiawi, adil, jujur dan tanpa diskriminasi.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">4. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak memperoleh layanan kesehatan yang bermutu sesuai dengan standar profesi dan standar prosedur operasional.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">5. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak memperoleh layanan yang efektif.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">6. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak mengajukan pengaduan atas kualitas pelayanan yang didapatkan.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">7. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak menerima dokter dan kelas perawatan sesuai dengan keinginannya dan peraturan yang berlaku di Rumah Sakit.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">8. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak meminta konsultasi tentang penyakit yang dideritanya kepada dokter lain (second opinion) yang mempunyai Surat Ijin Praktek (SIP) baik didalam maupun diluar Rumah Sakit.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">9. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak mendapatkan privasi dan kerahasiaan penyakit yang diderita termasuk data-data medisnya.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">10. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak mendapakan informasi yang meliputi diagnosis dan tata cra tindakan medis, tujuan tindakan medis, alternatif tidnakan, resiko dan komplikasi yang mungkin terjadi dan prognosis terhadap tindakan yang dilakukan serta perkiraan biaya pengobatan.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">11. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak memberikan persetujuan atau menolak atas tindakan yang akan dilakukan oleh tenaga kesehatan terhadap penyakit yang dideritanya.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">12. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak didampingi keluarganya dalam keadaan kritis.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">13. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak menjalankan ibadah sesuai agama atau kepercayaan yang dianutnya selama hal itu tidak mengganggu pasien lainnya.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">14. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak memperolah keamanan dan keselamatan dirinya selama dalam perawatan di Rumah Sakit.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">15. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak mengajukan usul, saran, perbaikan atas perlakuan terhadap dirinya.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">16. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak menolak pelayanan bimbingan rohani yang tidak sesuai dengan agama dan kepercayaan yang dianutnya.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">17. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak menggugat dan/atau menuntut Rumah Sakit apabila Rumah Sakit diduga memberikan pelayanan yang tidak sesuai dengan standar baik secara perdata ataupun pidana.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">18. </td>
                            <td style="text-align: justify;font-family: Arial">Pasien berhak mengeluhkan pelayanan Rumah Sakit yang tidak sesuai dengan standar pelayanan melalui media cetak dan elektronik sesuai dengan ketentuan peraturan perundang-undangan.
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: center;font-family: Arial;font-size: 12pt;" height="40"><b>KEWAJIBAN PASIEN DAN KELUARGA </b>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">1. </td>
                            <td style="text-align: justify;font-family: Arial">Mematuhi peraturan yang berlaku di rumah sakit.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">2. </td>
                            <td style="text-align: justify;font-family: Arial">Menggunakan fasilitas rumah sakit secara bertanggung jawab.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">3. </td>
                            <td style="text-align: justify;font-family: Arial">Menghormati hak-hak pasien lain, pengunjung dan hak tenaga kesehatan serta petugas lainnya bekerja di Rumah Sakit
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">4. </td>
                            <td style="text-align: justify;font-family: Arial">Memberikan informasi yang jujug, lengkap dan akurat sesuai kemampuan dan pengetahuannyang tentang masalah kesehatannya.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">5. </td>
                            <td style="text-align: justify;font-family: Arial">Memberikan informasi mengenai kemampuan finansial dan jaminan kesehatan yang dimilikinya.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">6. </td>
                            <td style="text-align: justify;font-family: Arial">Mengetahui rencana terapi yang direkomendasikannya oleh tenaga kesehatan di Rumah Sakit dan disetujui oleh pasien yang bersangkutan setelah mendapatkan penjelasan sesuai ketentuan peraturan perundang-undangan.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">7. </td>
                            <td style="text-align: justify;font-family: Arial">Menerima segala konsekwensi atas keputusan pribadinya untuk menolak rencana terapi yang direkomendasikan oleh tenaga kesehatan dan/atau tidak mematuhi petunjuk yang diberikan oleh tenaga kesehatan dalam rangka penyembuhan penyakut atau masalah kesehatan.
                            </td>
                        </tr>
                        <tr>
                            <td valign="top">8. </td>
                            <td style="text-align: justify;font-family: Arial">Memberikan imbalan jasa pelayanan yang diterima.
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td valign="top" width="60">
                                            <b>Sumber : </b>
                                        </td>
                                        <td style="text-align: justify;font-family: Arial">
                                            UU Nomor 44 tahun 2009 tantang Rumah Sakit. Permenkes RI Nomor 4 Tahun 2018 tentang Kewajiban Rumah Sakit dan Kewajiban Pasien.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td style="text-align: justify;font-family: Arial" colspan="3">
                                            Dengan ini saya menyatakan bahwa saya telah menerima dan memahami informasi sebagaimana diatas dan menyetujuinya
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td style="padding-top:30px;text-align: center;font-family: Arial" colspan="2">
                                            Yogyakarta, {{$detail[17]['value']}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center;font-family: Arial">
                                            Penanggung jawab Pasien
                                        </td>
                                        <td style="text-align: center;font-family: Arial">
                                            Petugas Pemberi Informasi
                                        </td>
                                        <td style="text-align: center;font-family: Arial">
                                            Saksi
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center;font-family: Arial;padding-top: 50px">
                                            {{$detail[18]['value']}}
                                        </td>
                                        <td style="text-align: center;font-family: Arial;padding-top: 50px">
                                            {{substr($detail[19]['value'],strpos($detail[19]['value'], "~")+1)}}
                                        </td>
                                        <td style="text-align: center;font-family: Arial;padding-top: 50px">
                                            {{$detail[20]['value']}}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
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
