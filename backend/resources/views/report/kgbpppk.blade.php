<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report Cetak KGB PPPK</title>
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
        #dt td{
            font-family: Arial;
            font-size: 11pt;
        }
    </style>
</head>

<body class="A4" style="font-family:Arial;height: auto">
    <section class="sheet padding-15mm" style="font-family:Arial">

        <table cellspacing="0" cellpadding="0" border="0" width="100%" >
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        <img src="data:image/jpeg;base64,{{$profile[0]->logopemerintahan}}" alt=""
                            style="width: 95px; margin-bottom:35px">

                    </td>
                    <td style="text-align: center; font-family: Arial">

                        <span style="font-size: 14pt">{{strtoupper($profile[0]->baris1)}}</span><br>
                        <span style="font-size: 18pt;">{{strtoupper($profile[0]->baris2)}}</span><br>
                        <!-- <span style="font-size: 14pt;">{{strtoupper($profile[0]->namalengkap)}}</span><br> -->
                        <!-- <img src="data:image/jpeg;base64,{{$profile[0]->gambarlogo}}" alt="" style="width: 230px;"><br> -->
                        <img src="data:image/jpeg;base64,{{$profile[0]->logodinkes}}" alt="" style="width: 180px;"><br>
                        <span color="#000000" style="font-size: 10pt">
                            Jalan Gondosuli No. 6
                            telepon (0274) 563153
                            faksimile (0274) 512368
                            <br>Website : dinkes.jogjaprov.go.id, Email : dinkes@jogjaprov.go.id
                            <br>YOGYAKARTA 55165
                        </span>
                    </td>
                    
                    
                </tr>
                <tr>
                    
                </tr>
            </tbody>
        </table>

        <hr style="border:1px solid #000;margin-bottom:0px">
        <hr style="border:0.5px solid #000;margin-top:2px">
        <table id="dt" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td colspan=3 style="text-align: center; font-family: Arial; font-size: 12pt">
                <br><br>
                    <b>KEPALA DINAS KESEHATAN
                    <br>
                    KEPUTUSAN KEPALA DINAS KESEHATAN
                    <br>
                    NOMOR : {{$data[0]->nosk}}
                    </b>
                </td>
                
            </tr>
            <tr>
                <td colspan=3 style="text-align: center; font-family: Arial; font-size: 12pt">
                <br>
                    <b>TENTANG
                    <br>
                    KENAIKAN GAJI BERKALA
                    <br>
                    DENGAN RAHMAT TUHAN YANG MAHA ESA
                    <br>
                    KEPALA DINAS KESEHATAN,
                    <br>
                    </b>                    
                </td>
                
            </tr>
            <tr>
                <td valign="top" width=10 style="font-family: Arial; font-size: 11pt"><br>Menimbang </td>
                <td valign="top" width=5 style="font-family: Arial; font-size: 11pt"><br>: </td>
                <td valign="top" width=250 style="text-align: justify;font-family: Arial; font-size: 11pt">
                <br> bahwa untuk melaksanakan ketentuan Pasal 6 ayat (1) Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Republik Indonesia Nomor 7 Tahun 2023 tentang Kenaikan Gaji Berkala dan Kenaikan Gaji Istimewa bagi Pegawai Pemerintah dengan Perjanjian Kerja, perlu menetapkan Keputusan Kepala Dinas Kesehatan tentang Kenaikan Gaji Berkala; 
                </td>
            </tr>
            <tr>
                <td valign="top" width=10 style="font-family: Arial; font-size: 11pt"><br>Mengingat </td>
                <td valign="top" width=5 style="font-family: Arial; font-size: 11pt"><br>: </td>
                <td valign="top" width=250 style="text-align: justify;font-family: Arial; font-size: 11pt">
                 
                <ol>
                    <li>Undang-Undang Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara (Lembaran Negara Republik Indonesia Tahun 2023 Nomor 141, Tambahan Lembaran Negara Republik Indonesia Nomor 6879);</li>
                    <li>Peraturan Pemerintah Nomor 49 Tahun 2018 tentang Manajemen Pegawai Pemerintah dengan Perjanjian Kerja (Lembaran Negara Republik Indonesia Tahun 2018 Nomor 224, Tambahan Lembaran Negara Republik Indonesia Nomor 6264);</li>
                    <li>Peraturan Presiden Republik Indonesia Nomor 98 Tahun 2020 Tentang Gaji dan Tunjangan Pegawai Pemerintah dengan Perjanjian Kerja (Lembaran Negara Republik Indonesia Tahun 2020 Nomor 218);</li>
                    <li>Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Republik Indonesia Nomor 7 Tahun 2023 tentang Kenaikan Gaji Berkala Istimewa bagi Pegawai Pemerintah dengan Perjanjian Kerja (Berita Negara Republik Indonesia Tahun 2023 Nomor 549);</li>
                    <li>Keputusan Sekretaris Daerah Daerah Istimewa Yogyakarta Nomor 70/SEKDA/XII/2023 tentang Pendelegasian Wewenang Pemberian Kenaikan Gaji Berkala bagi Pegawai Pemerintah dengan Pembagian Kerja di Lingkungan Pemerintah Daerah Daerah Istimewa Yogyakarta.</li>
                </ol>
                </td>
            </tr>
            <tr>
                <td colspan=3 height="60" style="text-align: center;padding-left: 5%;font-family: Arial; font-size: 11pt">
                    MEMUTUSKAN : 
                </td>
            </tr>
            <tr>
                <td valign="top" width=10 style="font-family: Arial; font-size: 11pt">Menetapkan </td>
                <td valign="top" width=5 style="font-family: Arial; font-size: 11pt">: </td>
                <td valign="top" width=250 style="text-align: justify;font-family: Arial; font-size: 11pt">
                KEPUTUSAN KEPALA DINAS KESEHATAN TENTANG PENDELEGASIAN WEWENANG PEMBERIAN KENAIKAN GAJI BERKALA 
                </td>
            </tr>
            <tr>
                <td valign="top" width=10 style="font-family: Arial; font-size: 11pt"><br>KESATU </td>
                <td valign="top" width=5 style="font-family: Arial; font-size: 11pt"><br>: </td>
                <td valign="top" width=250 style="text-align: justify;font-family: Arial; font-size: 11pt">
                <br>Memberikan Kenaikan Gaji Berkala kepada Pegawai Pemerintah dengan Perjanjian Kinerja di bawah ini : 
                </td>
            </tr>
            <tr>
                <td colspan=3 style="font-size: 11pt">
                    <table style="font-family: Arial; padding-left: 25%;line-height: 12px">
                        <tr>
                            <td style="font-size: 11pt" ><br>1. </td>
                            <td style="font-size: 11pt" ><br>N a m a</td>
                            <td style="font-size: 11pt"><br> : </td>
                            <td style="font-size: 11pt"><br>{{$data[0]->namalengkap}}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">2. </td>
                            <td style="font-size: 11pt">NIP</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">{{$data[0]->nippns}}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">3. </td>
                            <td style="font-size: 11pt">Golongan / Jabatan</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">{{$data[0]->panggol}}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">4. </td>
                            <td style="font-size: 11pt">Masa Perjanjian Kerja</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">1 Januari 2022 s.d. 31 Desember 2026</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">5. </td>
                            <td style="font-size: 11pt">Perpanjangan Perjanjian Kerja</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt"></td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">6. </td>
                            <td style="font-size: 11pt">Kantor / Unit Kerja</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">Rumah Sakit Jiwa Grhasia Dinkes DIY</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">7. </td>
                            <td style="font-size: 11pt">Gaji Lama</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">{{$data[0]->gajiawal}}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt"></td>
                            <td style="font-size: 11pt">atas dasar surat keputusan terakhir tentang pangkat / gaji yang ditetapkan</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt"> 
                                {{-- {{var_dump($data[0]->jenissk)}} --}}
                                
                                @if ($data[0]->jenisskco == 'KGB')
                                
                                    Surat Pemberitahuan Kenaikan Gaji Berkala
                                @elseif($data[0]->jenisskco == 'KP')
                                    Surat Keputusan Kenaikan Pangkat
                                @endif
                                
                                {{-- {{ $data[0]->jenissk == 'KGB' ? 'Kenaikan Gaji Berkala' : $data[0]->jenissk == 'KP' ? 'SK Kenaikan Pangkat': ''}} --}}
                            
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt"></td>
                            <td style="font-size: 11pt"></td>
                            <td style="font-size: 11pt"> </td>
                            <td style="font-size: 11pt">Nomor : {{$data[0]->sklama }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt"></td>
                            <td style="font-size: 11pt"></td>
                            <td style="font-size: 11pt"> </td>
                            <td style="font-size: 11pt">Tanggal : {{$data[0]->tglsklama }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt"></td>
                            <td style="font-size: 11pt"></td>
                            <td style="font-size: 11pt"> </td>
                            <td style="font-size: 11pt">Terhitung Mulai Tanggal : {{$data[0]->tmtlama }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt" colspan="4" height="30" style="padding-left: 6%">Diberikan Kenaikan Gaji Berkala sehingga memperoleh :</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">1. </td>
                            <td style="font-size: 11pt">Gaji Pokok Baru</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">{{$data[0]->gajiakhir}}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">2. </td>
                            <td style="font-size: 11pt">Berdasarkan Masa Kerja</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">{{explode(" ",$data[0]->masakerjagolongan)[0]}} Th {{sprintf("%02d", explode(" ",$data[0]->masakerjagolongan)[2])}} Bln</td>
                            {{-- <td style="font-size: 11pt">{{$data[0]->thn}} Thn {{$data[0]->bln}} Bln</td> --}}
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">3. </td>
                            <td style="font-size: 11pt">Dalam Golongan Ruang</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">{{$data[0]->golongan}}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt">4. </td>
                            <td style="font-size: 11pt">Terhitung Mulai Tanggal</td>
                            <td style="font-size: 11pt"> : </td>
                            <td style="font-size: 11pt">{{$data[0]->tmtbaru}}</td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
            <tr>
                <td valign="top" width=10 style="font-family: Arial; font-size: 11pt"><br>KEDUA </td>
                <td valign="top" width=5 style="font-family: Arial; font-size: 11pt"><br>: </td>
                <td valign="top" width=250 style="text-align: justify;font-family: Arial; font-size: 11pt">
                <br>Segala biaya yang diperlukan dalam rangka pelaksanaan Keputusan ini, dibebankan pada Anggaran Pendapatan dan Belanja Daerah RSJ Grhasia Tahun Anggaran 2024. 
                </td>
            </tr>
            <tr>
                <td valign="top" width=10 style="font-family: Arial; font-size: 11pt"><br>KETIGA </td>
                <td valign="top" width=5 style="font-family: Arial; font-size: 11pt"><br>: </td>
                <td valign="top" width=250 style="text-align: justify;font-family: Arial; font-size: 11pt">
                <br>Apabila di kemudian hari ternyata terdapat kekeliruan dalam Keputusan ini, akan diadakan perbaikan dan perhitungan kembali sebagaimana mestinya. 
                </td>
            </tr>
            <tr>
                <td valign="top" width=10 style="font-family: Arial; font-size: 11pt"><br>KEEMPAT </td>
                <td valign="top" width=5 style="font-family: Arial; font-size: 11pt"><br>: </td>
                <td valign="top" width=250 style="text-align: justify;font-family: Arial; font-size: 11pt">
                <br>Keputusan ini berlaku sejak tanggal ditetapkan. 
                </td>
            </tr>
            <tr>
                <td  colspan=3>
                    <table style="text-align:center;font-family: Arial; padding-left: 50%">
                        <tr>
                            <td style="font-size: 11pt"><br>Ditetapkan di Yogyakarta, <br> Pada tanggal {{$data[0]->tglttd}}</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 81px;font-size: 11pt" >Kepala Dinas Kesehatan DIY,</td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt"><b>drg. PEMBAJUN SETYANINGASTUTIE M.Kes. <br>
                            <hr style="margin: 0;" color="black"></b></td>
                        </tr>
                        <tr>
                            <td style="font-size: 11pt"><b>NIP. 19650912 199303 2 006</b></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan=3>
                    <table style="font-family: Arial;line-height: 12px">
                        <tr>
                            <td colspan="2" style="font-size: 11pt">Tembusan disampaikan kepada Yth.:</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px; font-size: 11pt" >1. </td>
                            <td style="font-size: 11pt">Kepala Badan Pengelolaan Keuangan dan Aset DIY</td>
                        </tr>
                        <tr>
                            <td style="padding-left: 20px; font-size: 11pt" >2. </td>
                            <td style="font-size: 11pt">Yang bersangkutan</td>
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
