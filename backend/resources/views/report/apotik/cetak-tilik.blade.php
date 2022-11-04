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
        size: landscape;   /* auto is the initial value */
        /* margin: 2cm 2cm 2cm 3cm;  this affects the margin in the printer settings */
    }
</style>
<style>

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }
    /* #dalamtd{

    } */
    .tabel tr td{
        border: 1px solid black;
        border-collapse: collapse;

    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }
    .tablemini{
        border-collapse: collapse;
    }
    .tablemini tr td{
        border: none;
        /* border-collapse: collapse; */

    }

    /* table, tr, td{
        border: 1px solid black;
    } */
</style>
<body style="background-color: #CCCCCC;">
    @foreach ($result as $r)
    <div align="center" >
    <table width="{{$pageWidth}}" bgcolor="#FFFFFF" >
        <tbody >
        <tr>
            <td align="center" style="width: 300px;" colspan="3">
                <b style="font-size: 12px;">
                    DAFTAR TILIK SERAH TERIMA OBAT FARMASI RAWAT INAP RS JIWA GRHASIA DISKES DIY
                </b>
            </td>
        </tr>
        <tr>
            <td colspan="3">
                IDENTITAS PASIEN
            </td>
        </tr>
        <tr>
            <td width="100px">
                Nama
            </td>
            <td width="30px">
                =
            </td>
            <td>
                {{$r['namapasien']}}
            </td>
        </tr>
        <tr>
            <td>
                Tanggal Lahir
            </td>
            <td>
                =
            </td>
            <td>
                {{date('d/m/Y', strtotime($r['tgllahir']))}}
            </td>
        </tr>
        <tr>
            <td>
                Rekam Medis
            </td>
            <td>
                =
            </td>
            <td>
                {{$r['nocm']}}
            </td>
        </tr>
        </tbody>
    </table>

        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel">
                <tr style="text-align: center">
                    <td width="180px" style="font-weight: bold; font-size: 8pt ">Nama Obat</td>
                    <td width="20px"style=" text-align: center; font-weight: bold; font-size: 8pt ">√</td>
                    <td width="50px" style=" text-align: center; font-weight: bold; font-size: 8pt ">Dosis</td>
                    <td width="20px" style="text-align: center; font-weight: bold; font-size: 8pt ">√</td>
                    <td width="30px" style=" font-weight: bold ; font-size: 8pt ">Rute</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Waktu</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Jam</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Petugas Farmasi</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Perawat Wisma</td>
                    <td width="180px" style="font-weight: bold; font-size: 8pt ">Nama Obat</td>
                    <td width="20px"style=" text-align: center; font-weight: bold; font-size: 8pt ">√</td>
                    <td width="50px" style=" text-align: center; font-weight: bold; font-size: 8pt ">Dosis</td>
                    <td width="20px" style="text-align: center; font-weight: bold; font-size: 8pt ">√</td>
                    <td width="30px" style=" font-weight: bold ; font-size: 8pt ">Rute</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Waktu</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Jam</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Petugas Farmasi</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Perawat Wisma</td>
                    <td width="180px" style="font-weight: bold; font-size: 8pt ">Nama Obat</td>
                    <td width="20px"style=" text-align: center; font-weight: bold; font-size: 8pt ">√</td>
                    <td width="50px" style=" text-align: center; font-weight: bold; font-size: 8pt ">Dosis</td>
                    <td width="20px" style="text-align: center; font-weight: bold; font-size: 8pt ">√</td>
                    <td width="30px" style=" font-weight: bold ; font-size: 8pt ">Rute</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Waktu</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Jam</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Petugas Farmasi</td>
                    <td width="20" style=" font-weight: bold ; font-size: 8pt ">Perawat Wisma</td>
                </tr>
                @foreach ($r['details'] as $rr)
                    <tr>
                        <td valign="top"style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatmalam'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt"width="180px">{{$item['obatmalam']}}</td>
                                    
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td width="20px" style="border-left: 1px solid black"></td>
                        <td valign="top"style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatmalam'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt;"width="25px">{{$item['aturanmalam']}}</td>
                                    <td valign="top" style="font-size: 7pt;"width="25px">{{$item['satuanmalam']}}</td>
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td ></td>
                        <td width="30px" valign="top" style="font-size: 7pt" style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatmalam'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt">{{$item['rutemalam']}}</td>
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td valign="top" style="font-weight: bold;font-size: 7pt">{{date('d/m/Y', strtotime($rr['tglmalam']))}} <br><p style="writing-mode: vertical-rl;text-orientation: upright;text-align: center">{{$rr['waktumalam']}}</p></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td valign="top"style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatmalam'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt"width="180px">{{$item['obatmalam']}}</td>
                                    
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td width="20px" style="border-left: 1px solid black"></td>
                        <td valign="top"style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatpagi'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt;"width="25px">{{$item['aturanpagi']}}</td>
                                    <td valign="top" style="font-size: 7pt;"width="25px">{{$item['satuanpagi']}}</td>
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td ></td>
                        <td width="30px" valign="top" style="font-size: 7pt" style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatpagi'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt">{{$item['rutepagi']}}</td>
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td valign="top" style="font-weight: bold;font-size: 7pt">{{date('d/m/Y', strtotime($rr['tglpagi']))}} <br><p style="writing-mode: vertical-rl;text-orientation: upright;text-align: center">{{$rr['waktupagi']}}</p></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td valign="top"style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatsiang'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt"width="180px">{{$item['obatsiang']}}</td>
                                    
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td width="20px" style="border-left: 1px solid black"></td>
                        <td valign="top"style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatsiang'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt;"width="25px">{{$item['aturansiang']}}</td>
                                    <td valign="top" style="font-size: 7pt;"width="25px">{{$item['satuansiang']}}</td>
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td ></td>
                        <td width="30px" valign="top" style="font-size: 7pt" style="font-size: 7pt">
                            <table class="tablemini" >
                            @foreach ($rr['obatsiang'] as $item)
                                <tr>
                                    <td valign="top" style="font-size: 7pt">{{$item['rutesiang']}}</td>
                                </tr>
                            @endforeach
                            </table>
                        </td>
                        <td valign="top" style="font-weight: bold;font-size: 7pt">{{date('d/m/Y', strtotime($rr['tglsiang']))}} <br><p style="writing-mode: vertical-rl;text-orientation: upright;text-align: center">{{$rr['waktusiang']}}</p></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                @endforeach
        </table>
    </div>
@endforeach

<script>
    window.print()
</script>
</body>
</html>