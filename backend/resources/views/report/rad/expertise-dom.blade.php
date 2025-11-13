<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>HASIL PEMERIKSAAN RADIOLOGI</title>
    {{-- <script src="js/jquery.min.js"></script>
    <script src="js/jquery.qr-code.js"></script>
    <link href="css/style.css" rel="stylesheet">
    <script src="js/angular/angular.min.js" type="text/javascript"></script>
    <script src="js/angular/angular-route.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/angular/angular-animate.min.js"></script>
    <script type="text/javascript" src="js/angular/angular-aria.min.js"></script>
    <script src="js/angular/angular-material.js" type="text/javascript"></script> --}}
    {{-- @if(stripos(\Request::url(), 'localhost') !== FALSE)
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
    @endif --}}
    <style>
        @media print {
            td.merah {
                background-color: #d54242 !important;
                -webkit-print-color-adjust: exact; 
            }
            td.kuning {
                background-color: #c5d542 !important;
                -webkit-print-color-adjust: exact; 
            }
            td.hijau {
                background-color: #42d55b !important;
                -webkit-print-color-adjust: exact; 
            }
            td.hitam {
                background-color: #000000 !important;
                -webkit-print-color-adjust: exact; 
            }
        }
        @page {
            size: A4  ;
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
        /* table {
            width: 100%;
            height: 100%;
        } */
        /* .kotak {
            width: 50px;
            height: 20px;
        } */
        .merah {
            background-color: #d54242 !important;
        }
        .kuning {
            background-color: #c5d542 !important;
        }
        .hijau {
            background-color: #42d55b !important;
        }
        .hitam {
            background-color: #000000 !important;
        }
        .bmerah {
            border:thin solid #d54242;
        }
        
        .bkuning {
            border:thin solid #c5d542;
        }
        
        .bhijau {
            border:thin solid #42d55b;
        }
        
        .bhitam {
            border:thin solid #000000;
        }
        .border-lr {
             border-collapse: collapse;
        }
        .border-lr td {
            border: thin solid #000;
        }

        // adi nambahin 
        .border-lr th {
            border: thin solid #000;
        }

        .border-doang {
            border-collapse: collapse;
            border: thin solid #000;
            border-top:none;
        }
        .border-doang td {
            padding:5px;
        }
        .judulLabel {
            font-weight: bold;
        }
        .table-resume {
            border: 1px solid black;
            border-collapse: collapse;
        }
    </style>
</head>
    <body>
    <section class="sheet padding-10mm" style="font-family:Tahoma;height: auto; page-break-after: page; ">
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 10px !important; border: none">
            <tr style="padding: 10px !important:">
                <td colspan="12" width="100%" align="center" style="margin-bottom: 7px !important; border: none;">                           
                    <div style="margin-top: -20px;">
                        <img src="img/logo_grhasia_com.png" style="width: 80px" border="0">
                    </div>                     
                    <div>
                        @php
                            $d = App\Http\Controllers\Report\ReportController::getProfile();
                        @endphp
                        <font style="font-size:9pt;" color="#000000" >
                            {!! $d['namaprofile'] !!}
                        </font><br>
                        <font style="font-size: 9pt;" color="#000000" >
                            {!! $d['alamat'] !!}       
                        </font>
                    </div>     
                </td>
            </tr>
            <tr>
                <td colspan="12"><hr style="border: 0.5px solid black;"></td>
            </tr>
            <tr>
                <td colspan="12">
                    <div style="margin-top: -10px;">
                        <hr style="border: 0.5px solid black;">
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="12" align="center" style="font-size: 16px; font-weight: bold; padding: 12px; border: none !important;">
                    <div style="margin-top: -10px;">
                    HASIL PEMERIKSAAN RADIOLOGI
                    </div>
                </td>
            </tr>
        </table>
        
        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 10px;">
            <tr>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">No Foto</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial"> {{ $raw->nofoto }}</font></b></td>
                <td width="5%"></td>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">No Radiologi</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{   $raw->noregistrasi  }}</font></b></td>

            </tr>
             <tr>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">No Rekam Medis</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{   $raw->nocm }} </font></b></td>
                <td width="5%"></td>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Kelamin</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{  $raw->jeniskelamin    }} </font></b></td>

            </tr>
            <tr>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Nama</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{ $raw->namapasien   }} </font></b></td>
                <td width="5%"></td>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Alamat</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{  $raw->alamatlengkap }} </font></b></td>        
            </tr>
            <tr>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Tanggal Lahir</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tgllahir)}}</font></b></td>
                <td width="5%"></td>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Cara Bayar</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{ $raw->kelompokpasien  }}  </font></b></td>

            </tr>
            <tr>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Asal Pasien</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{ $raw->namaruangan }} </font></b></td>
                <td width="5%"></td>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Cetak</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{ App\Traits\Valet::getDateIndo(date('Y-m-d')).date(' H:i:s')   }}  </font></b></td>        
            </tr>
            <tr>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Tgl Transaksi</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tglpelayanan).' '.substr($raw->tglpelayanan,10,9)   }} </font></b></td>
                <td width="5%"></td>
                <td width="15%">
                    <font style="font-size: 9pt" face="Arial">Nama Pemeriksaan</font>
                </td>
                <td>:</td>
                <td width="30%"><b><font style="font-size: 9pt" face="Arial">{{ $raw->namaproduk  }}  </font></b></td>        
            </tr>
        </table>

        <div style="text-align: left; font-weight: bold; font-size: 14px; padding: 10px;">Hasil Pemeriksaan</div>
        
        <table style="border-collapse: collapse; padding: 10px; margin-top: -10px;" cellspacing="0" cellpadding="0" bordercolor="#000000" border="" width="100%" rules=none>
            <tr>
                <td bordercolor="#808080">
                    <p style="text-align: left;font-weight: bold"> </p>
                    <p  style="text-align: left;font-weight: bold">{{ (string) $raw->namaproduk}}</p>
        
                    @php
                        // $exper = explode('~',$raw->keterangan);
                        // $datas =[];
                        // foreach ($exper as $r){
                        //     $datas [] = array(
                        //         'ket' =>(string)  $r
                        //     );
                        // }
        
                    @endphp
                    <div style="text-align: left;font-size: 12px">
                    
                        <p style="margin-block-start: 0px;
                        margin-block-end: 0px;
                        margin-inline-start: 0px;
                        margin-inline-end: 0px;">
                            {!!  nl2br(str_replace('~','<br/>',$raw->keterangan )) !!}
                        </p>
        
                   
                    </div>
                </td>
            </tr>
        </table>

        <div class="grid_12" style="padding: 10px;">
            <div class="grid_4"></div>
            <div class="grid_4"></div>
            <div class="grid_4">
                <div class="grid_12">
                    <div><font style="font-size: 12px" face="Arial"></font></div>
                    <div><font style="font-size: 12px;" face="Arial"></font></div>
                    <div align="center"><img src="" ></div>
                    <div><font face="Arial" style="font-size: 12px"><b></i></font></div>

                </div>
            </div>
        </div>

        <table style="width: 100%">
            <tr>
                <td style="width: 70%">&nbsp;</td>              
              <td style="text-align: center; width: 30%">
                    <font style="font-size: 9pt" face="Arial">Bandung, {{ App\Traits\Valet::getDateIndo($raw->tanggal).' '.substr($raw->tanggal,10,9)   }} </font>
                    <br>
                    <font style="font-size: 9pt" face="Arial">Pemeriksa</font><br>
                  <div style="padding-top: 10; padding-bottom: 3">
                    <img src="data:image/png;base64,{!! $qrcode2 !!}" >
                  </div>
                  <br>
                    <font face="Arial" style="font-size: 9pt"><b>{{ '( '. $raw->dokterrad .' )'}} </b></font>
                </td>
            </tr>
        </table>
    </section>
    </body>
</html>