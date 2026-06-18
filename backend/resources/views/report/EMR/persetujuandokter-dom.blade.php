{{-- @extends('report.dom') --}}
@php
    function toUppercase($string) {
        $string = str_replace(['-', '_'], ' ', $string); 
        return ucwords(strtolower($string));
    }
@endphp
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Persetujuan Umum Untuk Tindakan Kedokteran</title>
    {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">
    {{-- @else
        <link rel="stylesheet" href="service/css/report/paper.css">
        <link rel="stylesheet" href="service/css/report/table.css">
        <link rel="stylesheet" href="service/css/report/tabel.css">

        <link href="service/css/style.css" rel="stylesheet">
        /
    @endif --}}

    <style>
        @page {
        size: A4;
        margin: 5mm 5mm 6mm 5mm; /* atas, kanan, bawah, kiri */
        }

        body {
            margin: 0 !important;
            padding: 0 !important;
        }

        .page {
            page-break-after: always;
        }

        .block {
            break-inside: avoid;
            page-break-inside: avoid;
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
            margin-top: 30px;
            margin-left: 500px;
            }
        .footer3 {
            text-align: center;
            position: fixed;
            left: 1%;
            bottom: 10%;
            right: 1%;
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

        .text-justify {
            text-align: justify;
            text-justify: inter-word;
        }
    </style>

</head>
<body>
         <section class="block" style="font-family:Arial;">
            <table cellspacing="0" cellpadding="0" border="0" width="750px">
                <tbody>
                    <tr>
                        <td style="border-bottom:3px solid black; padding-bottom:1em; width: 15%;">
                            <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 100%;">
                            {{-- <img src="img/diy.png" alt="Logo" style="width: 100%;"> --}}
                        </td>
                        <td style="border-bottom:3px solid black; padding-bottom:1em; text-align:center;">
                            <p style="margin:0; padding:0;">{{ $res['profile']->baris1 }}</p>
                            <p style="font-weight:bold; margin:0; padding:0;">{{ $res['profile']->baris2 }}</p>
                            <p style="font-weight:bold; margin:0; margin-bottom:.3cm; padding:0;">{{ strtoupper($res['profile']->namalengkap) }}</p>
                            <img src="img/aksara_jawa-com.png" alt="Logo" style="height: .8cm;">
                            <p style="font-size:8pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos }}, Telepon: (0274) 895143, 895297</p>
                            <p style="font-size:8pt; margin:0;">Faksimile: {{ $res['profile']->faksimile }}, Pos-el: <span style="text-decoration:underline; color:blue;">{{ $res['profile']->alamatemail }}</span>,</p>
                            <p style="font-size:8pt; margin:0;">Laman: {{ $res['profile']->website }}</p>
                        </td>
                        <td style="border-bottom:3px solid black; padding-bottom:1em; width: 250px;">
                            {{-- <img src="img/logo_grhasiafull.png" alt="Logo" style="width: 100%;"> --}}
                            <table border="1" width="250px">
                                <tr>
                                    <td>
                                        <table border="0" width="250px">
                                            <tr>
                                                <td  style="">Nomor RM</td>
                                                <td width="1px">:</td>
                                                <td>
                                                    {{ isset($data[0]->nocm) ? toUppercase($data[0]->nocm) : '' }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td  style="">Nama Pasien</td>
                                                <td width="1px">:</td>
                                                <td>
                                                    {{ isset($data[0]->namapasien) ? toUppercase($data[0]->namapasien) : '' }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td  style="">Tanggal Lahir</td>
                                                <td width="1px">:</td>
                                                <td>
                                                    {{ isset($data[0]->tgllahir) ? date('d-m-Y',strtotime( $data[0]->tgllahir)) : '' }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td  style="">Jenis Kelamin</td>
                                                <td width="1px">:</td>
                                                <td>
                                                    {{ isset($data[0]->jeniskelamin) ? toUppercase($data[0]->jeniskelamin) : '' }}
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

            <table  cellspacing="0" cellpadding="0" border="0" width="790px" bgcolor="#FFFFFF">
                <tr>
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px;" colspan="6">PERSETUJUAN UMUM UNTUK TINDAKAN KEDOKTERAN</th>
                </tr>
                            <tr>
                                <td style="padding-left: 1px;">Nama (lengkap)</td>
                                <td width="1px">:</td>
                                <td colspan="4">
                                    {{ isset($item[1901308800]) ? toUppercase($item[1901308800]) : '' }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-left: 1px">Nama Penerima Informasi</td>
                                <td width="1px">:</td>
                                <td>
                                    {{ isset($item[1901308810]) ? toUppercase($item[1901308810]) : '' }}
                                </td>
                                <td>NIK</td>
                                <td width="1px">:</td>
                                <td>
                                    {{ isset($item[1901308820]) ? toUppercase($item[1901308820]) : '' }}
                                </td>
                            </tr>
                            <tr>
                                <td  style="padding-left: 1px">Alamat</td>
                                <td width="1px">:</td>
                                <td colspan="4" rowspan="2" style="vertical-align: top">
                                        {{ isset($item[1901308830]) ? toUppercase($item[1901308830]) : '' }}
                                </td>
                            </tr> 
                            <tr>
                                <td colspan="2"></td>
                            </tr>
                            <tr>
                                <td  style="padding-left: 1px">Hubungan Dengan Pasien</td>
                                <td width="1px">:</td>
                                <td>{{ isset($item[1901308840]) ? toUppercase($item[1901308840]) : '' }}</td>
                                @if ( isset($item[1901308850]) )
                                <td colspan="3">Laki-laki</td>
                                @endif
                                @if (isset($item[1901308860]))
                                <td colspan="3">Perempuan</td>
                                @endif
                            </tr>
                            <tr>
                               <td colspan="6" class="text-justify" style="padding-top: 8px;">
                                    <strong>1. PERSETUJUAN ASUHAN KESEHATAN</strong>
                                </td>
                            <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px;">
                                    Saya menyadari bahwa tindakan kedokteran adalah berisiko, meliputi tindakan medis berupa preventif, diagnostik, 
                                    terapeutik atau rehabilitatif yang dilakukan oleh dokter atau dokter gigi terhadap Pasien.
                                </td>
                            </tr>
                             <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px;">
                                    Saya menyetujui segala pelayanan medis di RS Jiwa Grhasia sebagaimana sesuai dengan keadaan medis saya selama 
                                    mendapatkan pelayanan medis di RS Jiwa Grhasia.
                                </td>
                            </tr>
                             <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px;">
                                    Saya dengan ini memberikan persetujuan (kecuali yang membutuhkan persetujuan khusus/tertulis) dengan tidak dapat 
                                    ditarik kembali kepada RS Jiwa Grhasia, dalam memberikan pelayanan medis, pemeriksaan fisik yang dapat dilakukan 
                                    oleh dokter atau perawat, serta melakukan prosedur diagnostik atau terapi dan tatalaksana sesuai pertimbangan dokter 
                                    yang diperlukan atau disarankan pada pelayanan medis untuk saya.
                                    Hal ini mencakup seluruh pemeriksaan dan prosedur diagnostik rutin, termasuk namun tidak terbatas pada x-ray, pemberian 
                                    dan/atau tindakan kedokteran serta penyuntikan (intramuskular, intravena dan prosedur invasif lainnya), produk farmasi 
                                    dan obat-obatan, pemasangan alat medis, dan pengambilan darah untuk pemeriksaan laboratorium atau pemeriksaan patologi 
                                    yang dibutuhkan untuk pelayanan medis saya.
                                </td>
                            </tr>
                             <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px;">
                                    Saya mempercayakan kepada semua tenaga kesehatan rumah sakit untuk memberikan perawatan, diagnostik, dan terapi kepada saya 
                                    sebagai pasien rawat inap, rawat jalan, atau Instalasi Gawat Darurat (IGD), termasuk semua pemeriksaan penunjang yang 
                                    dibutuhkan untuk pengobatan dan tindakan yang diperlukan.
                                </td>
                            </tr>
                            <tr>
                               <td colspan="6" class="text-justify">
                                    <strong>2. KEJADIAN TIDAK TERDUGA / DIHARAPKAN</strong>
                                </td>
                            </tr>
                            <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px;">
                                    Saya mengerti dan menyadari bahwa dalam tindakan kedokteran dapat terjadi adanya kejadian tidak terduga/diharapkan 
                                    (unanticipated outcome) yang dapat merupakan efek samping dari tindakan kedokteran yang tidak dapat diduga sebelumnya 
                                    (termasuk antara lain namun tidak terbatas pada Steven Johnson Syndrome dan syok anafilaktik).<br>
                                    Saya mengerti bahwa hasil asuhan dan pengobatan termasuk kejadian yang tidak terduga/diharapkan akan diberitahukan kepada 
                                    saya dan keluarga oleh Dokter Penanggung Jawab Pasien (DPJP).
                                </td>
                            </tr>
                                    
                            <tr>
                               <td colspan="6" class="text-justify">
                                    <strong>3. PENETAPAN PIHAK YANG DIIJINKAN</strong>
                                </td>
                            </tr>
                            <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px;">
                                    Saya telah mendapat izin dari pasien/penanggung jawab pasien untuk berpartisipasi dalam pengambilan keputusan terkait 
                                    perawatan di RS Jiwa Grhasia.
                                </td>
                            </tr>
                            <tr>
                               <td colspan="6" class="text-justify">
                                    <strong>4. RUMAH SAKIT LAYANAN PENDIDIKAN</strong>
                                </td>
                            </tr>
                            <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px;">
                                    Saya mengetahui bahwa Rumah Sakit Jiwa Grhasia merupakan rumah sakit yang digunakan untuk pendidikan dan praktik klinik 
                                    mahasiswa kedokteran dan profesi kesehatan lainnya. Untuk itu, saya menyetujui mereka berpartisipasi dalam proses 
                                    perawatan pasien sepanjang berada di bawah supervisi Penanggung Jawab Pasien yaitu dokter, perawat, dan tenaga kesehatan 
                                    lain. Hal ini dikecualikan bagi pasien kelas VIP.
                                </td>
                            </tr>
                             <tr>
                               <td colspan="6" style="text-align: center">
                                    <strong>TATA TERTIB DAN PERATURAN RUMAH SAKIT</strong>
                                </td>
                            </tr>
                             <tr>
                               <td colspan="6">
                                    1. HAK, KEWAJIBAN, DAN TANGGUNG JAWAB SEBAGAI PASIEN.
                                </td>
                            </tr>
                             <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Dengan menandatangani dokumen ini saya, pasien atau penanggung jawab, wali ataupun keluarga yang menandatangani dokumen ini 
                                    untuk dan atas nama saya menyatakan bahwa telah memperoleh dan menerima semua informasi mengenai hak-hak, kewajiban, dan 
                                    tanggung jawab pasien pada saat proses pendaftaran dan selama mendapatkan pelayanan medis di RS Jiwa Grhasia, antara lain 
                                    sebagaimana tercantum pada halaman belakang persetujuan umum ini.
                                </td>
                            </tr>
                             <tr>
                               <td colspan="6">
                                    2. AKSES INFORMASI KESEHATAN.
                                </td>
                            </tr>
                             <tr>
                               <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Saya dengan ini memberikan persetujuan kepada RS Jiwa Grhasia untuk memberikan informasi tentang hal-hal yang berkaitan 
                                    dengan kesehatan saya kepada penanggung jawab, keluarga, atau pihak yang menjamin biaya perawatan saya di RS Jiwa Grhasia, 
                                    kepada (tulis nama, minimal 2):
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding-left: 25px">a. : {{ isset($item[1901308870]) ? toUppercase($item[1901308870]) : '' }}</td>
                                <td colspan="3" style="padding-left: 25px">b. : {{ isset($item[1901308880]) ? toUppercase($item[1901308880]) : '' }}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding-left: 25px">c. : {{ isset($item[1901308890]) ? toUppercase($item[1901308890]) : '' }}</td>
                                <td colspan="3" style="padding-left: 25px">d. : {{ isset($item[1901308900]) ? toUppercase($item[1901308900]) : '' }}</td>
                            </tr>
                            <tr>
                                <td colspan="6">
                                    3. RAHASIA KEDOKTERAN.
                                </td>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Saya setuju RS Jiwa Grhasia menjamin rahasia kedokteran saya dan hanya menggunakannya untuk kepentingan perawatan
                                    atau pengobatan, penagihan asuransi, pendidikan maupun penelitian, kecuali saya mengungkapkan sendiri atau orang lain / pihak lain 
                                    yang saya beri kuasa untuk itu.
                                </td>
                            </tr>

                            <tr>
                                <td colspan="6">
                                    4. PRIVASI
                                </td>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Apabila saya memerlukan hal-hal yang menyangkut privasi saya sebagai pasien, saya menyampaikan kepada staf RS Jiwa Grhasia.
                                </td>
                            </tr>

                            <tr>
                                <td colspan="6">
                                    5. BARANG PRIBADI
                                </td>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Saya menyatakan bahwa RS Jiwa Grhasia telah menyarankan untuk tidak membawa barang-barang berharga 
                                    (seperti perhiasan, elektronik, dll.). Dalam hal barang-barang berharga tersebut tetap dibawa ke lingkungan RS Jiwa Grhasia 
                                    oleh saya atau pihak manapun, maka RS Jiwa Grhasia tidak akan bertanggung jawab atas kehilangan, kerusakan atau pencurian 
                                    atas barang berharga tersebut.
                                </td>
                            </tr>

                            <tr>
                                <td colspan="6">
                                    6. PENGAJUAN KELUHAN
                                </td>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Saya dengan ini menyatakan bahwa saya telah menerima informasi dan telah mengerti tata cara pengajuan dan tindak lanjut 
                                    bila ada keluhan saya sebagai pasien terkait pelayanan yang diberikan. Saya setuju untuk mengikuti tata cara pengajuan keluhan 
                                    sesuai dengan prosedur yang ada. RS Jiwa Grhasia tidak wajib menindak-lanjuti keluhan saya apabila tidak diajukan sesuai dengan 
                                    prosedur yang berlaku dan tidak wajib untuk bertanggung jawab atas setiap kerugian yang timbul dari keluhan yang tidak diajukan 
                                    sesuai prosedur.
                                </td>
                            </tr>

                            <tr>
                                <td colspan="6">
                                    7. KEWAJIBAN PEMBAYARAN
                                </td>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Dengan ini saya atau penanggung jawab, wali ataupun keluarga saya menyatakan setuju bahwa sesuai dengan pertimbangan pelayanan 
                                    yang diberikan kepada saya, maka saya wajib untuk melakukan pembayaran atas seluruh biaya pelayanan, yang akan ditentukan 
                                    berdasarkan acuan biaya dan ketentuan RS Jiwa Grhasia.
                                </td>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Apabila asuransi kesehatan swasta atau program pemerintah menanggung pembiayaan atas pelayanan kesehatan terhadap saya, 
                                    saya dengan ini memberikan kewenangan kepada RS Jiwa Grhasia untuk memberi tagihan kepada asuransi terkait atas seluruh 
                                    pelayanan dan tindakan kedokteran yang telah dilakukan. Asuransi dapat menetapkan bahwa sebagian biaya tetap menjadi tanggung 
                                    jawab pribadi, oleh karenanya RS Jiwa Grhasia berhak memberi tagihan atas biaya yang tidak ditanggung tersebut, dan saya atau 
                                    penanggung jawab setuju untuk membayarnya.
                            </td>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-justify" style="padding-left: 10px">
                                    Saya dengan ini memberikan persetujuan kepada RS Jiwa Grhasia untuk memberikan rahasia kedokteran atas Rekam Medis saya kepada 
                                    perusahaan asuransi terkait sesuai keperluan penagihan tersebut.

                                    Apabila di kemudian hari saya tidak lagi ditanggung oleh asuransi, maka saya atau penanggung jawab, wali ataupun keluarga saya 
                                    setuju untuk secara pribadi bertanggung jawab membayar seluruh biaya pelayanan dan tindakan kedokteran dari RS Jiwa Grhasia.
                                </td>
                            </tr>

                            <tr>
                                <td colspan="6" class="text-justify" style="padding-bottom: 8px">
                                    <strong>SAYA TELAH DIJELASKAN, MEMBACA, MEMAHAMI, dan SEPENUHNYA SETUJU terhadap pernyataan tersebut di atas.</strong>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="6">
                                    <table cellspacing="0" cellpadding="0" border="0" width="790px" bgcolor="#FFFFFF">
                                        <tr>
                                            <td style="text-align: center;">
                                                <b>Yang menjelaskan</b>
                                            </td>
                                            <td style="text-align: center;">
                                            </td>
                                            <td style="text-align: center;">
                                                Yogyakarta, {{ isset($item[1901308910]) ? toUppercase($item[1901308910]) : '' }}<br>
                                                <b>Pasien / Penanggung Jawab</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                &nbsp;
                                            </td>
                                            <td>
                                                &nbsp;
                                            </td>
                                                <td style="text-align: center">
                                                    
                                                            @forelse($dataimg as $d)
                                                            @if($d->emrdfk == 1)
                                                            <img src="{{ $d->image }}" style="width: 120px; height: 90px;"/>
                                                            @break    
                                                            @endif   
                                                            @empty
                                                            @endforelse
                                                </td>
                                        </tr>
                                        <tr>
                                            <td style="text-align: center;">
                                                <b>{{ isset($item[1901308920]) ? toUppercase($item[1901308920]) : '' }}</b>
                                            </td>
                                            <td style="text-align: center;">
                                            </td>
                                            <td style="text-align: center;">
                                                <b>{{ isset($item[1901309791]) ? toUppercase($item[1901309791]) : '' }}</b>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                <tr>
                    <td width="100%" colspan="6" style="text-align: center; padding-top: 5px;">
                        <strong>HAK PASIEN / KELUARGA</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="text-justify">
                        (Sesuai Pasal 32 UU No.44 Tahun 2009 tentang Rumah Sakit)
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="text-justify">
                        <ol>
                            <li>Memperoleh informasi mengenai tata tertib dan peraturan yang berlaku di Rumah Sakit.</li>
                            <li>Memperoleh informasi tentang hak dan kewajiban pasien.</li>
                            <li>Memperoleh layanan yang manusiawi, adil, jujur, dan tanpa diskriminasi.</li>
                            <li>Memperoleh layanan kesehatan yang bermutu sesuai dengan standar profesi dan standar prosedur operasional.</li>
                            <li>Memperoleh layanan yang efektif dan efisien sehingga pasien terhindar dari kerugian fisik dan materi.</li>
                            <li>Mengajukan pengaduan atas kualitas pelayanan yang didapatkan.</li>
                            <li>Memilih dokter dan kelas perawatan sesuai keinginan dan peraturan yang berlaku di Rumah Sakit.</li>
                            <li>Meminta konsultasi tentang penyakit kepada dokter lain yang memiliki Surat Ijin Praktek (SIP) baik di dalam maupun luar Rumah Sakit.</li>
                            <li>Mendapatkan privasi dan kerahasiaan penyakit termasuk data-data medisnya.</li>
                            <li>Mendapat informasi mencakup diagnosis, tindakan medis, tujuan, alternatif tindakan, risiko, komplikasi, prognosis, serta perkiraan biaya.</li>
                            <li>Memberikan persetujuan atau menolak tindakan medis.</li>
                            <li>Didampingi keluarga dalam keadaan kritis.</li>
                            <li>Menjalankan ibadah sesuai agama/kepercayaan tanpa mengganggu pasien lain.</li>
                            <li>Memperoleh keamanan dan keselamatan selama perawatan di Rumah Sakit.</li>
                            <li>Mengajukan saran perbaikan atas perlakuan Rumah Sakit.</li>
                            <li>Menolak bimbingan rohani yang tidak sesuai dengan agama/kepercayaan.</li>
                            <li>Menuntut Rumah Sakit apabila pelayanan tidak sesuai standar.</li>
                            <li>Mengeluhkan pelayanan melalui media sesuai ketentuan perundang-undangan.</li>
                        </ol>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" style="text-align: center">
                        <strong>KEWAJIBAN PASIEN / KELUARGA</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="text-justify">
                        (sesuai Pasal 26 Peraturan Menteri Kesehatan RI No 4 tahun 2018 tentang Kewajiban Rumah Sakit dan Kewajiban Pasien)<br>
                        Dalam menerima pelayanan dari Rumah Sakit, Pasien mempunyai kewajiban :
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="text-justify">
                        <ol>
                            <li>Mematuhi peraturan yang berlaku di Rumah Sakit Jiwa Grhasia.</li>
                            <li>Menggunakan fasilitas rumah sakit secara bertanggung jawab.</li>
                            <li>Menghormati hak pasien lain, pengunjung, tenaga kesehatan, dan petugas lain.</li>
                            <li>Memberikan informasi jujur, lengkap, dan akurat tentang kesehatan.</li>
                            <li>Memberikan informasi mengenai kemampuan finansial dan jaminan kesehatan.</li>
                            <li>Mematuhi rencana terapi yang direkomendasikan Tenaga Kesehatan.</li>
                            <li>Menerima konsekuensi atas keputusan menolak atau tidak mematuhi terapi.</li>
                            <li>Memberikan imbalan jasa atas pelayanan yang diterima.</li>
                        </ol>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" style="text-align: center">
                        <strong>TANGGUNG JAWAB PASIEN / KELUARGA</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="text-justify">
                        Dalam menerima pelayanan dari Rumah Sakit, Pasien mempunyai tanggung jawab :
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="text-justify">
                        <ol>
                            <li>Berpartisipasi aktif dalam diskusi dan keputusan mengenai perawatan kesehatan.</li>
                            <li>Memberikan informasi lengkap mengenai kesehatan dan riwayat kesehatan.</li>
                            <li>Mendiskusikan masalah kesehatan, kekhawatiran, dan perubahan kondisi secara jujur.</li>
                            <li>Bekerja sama dengan petugas kesehatan serta berperilaku sopan.</li>
                            <li>Menghormati hak penyedia layanan kesehatan dan tidak melakukan kekerasan fisik/verbal.</li>
                            <li>Mengikuti instruksi asuhan atau memberi tahu jika tidak dapat mengikutinya.</li>
                            <li>Menerima konsekuensi menolak rencana asuhan atau tidak mengikuti instruksi.</li>
                            <li>Memberitahu staf rumah sakit bila mengubah keputusan persetujuan atas asuhan.</li>
                        </ol>
                    </td>
                </tr>

                
            </table>

            {{-- <div class="footer2">
                <table>
                    <tbody>
                        <tr>
                            <td style="text-align: center;">
                                Yogyakarta, {{toUppercase($item[1901301260])}}<br>
                                <b>Yang Membuat Pernyataan</b>
                            </td>
                        </tr>
                        <tr>
                                <td>
                                    <div style="width: 120px; height: 90px; border-style: none; margin: auto; float: none; text-align: center;">
                                            @forelse($dataimg as $d)
                                            @if($d->emrdfk == 1)
                                            <img src="{{ $d->image }}" style="width: 120px; height: 90px;"/>
                                            @break    
                                            @endif   
                                            @empty
                                            @endforelse
                                        </div>
                                </td>
                        </tr>
                        <tr>
                            <td style="text-align: center">
                                <br>{!! $item[1901301200] !!}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div> --}}
        </section>
    </body>
</html>

