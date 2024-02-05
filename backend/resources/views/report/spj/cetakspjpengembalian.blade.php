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
    @page {   /* auto is the initial value */
        margin: 0;  /* this affects the margin in the printer settings */
        size: potrait;
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
<div align="center" >
    <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="950" style="padding:25px">
        <tbody>
            <tr>
                <td>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td width="100%" align="center">
                                <font style="font-size: 14pt;font-weight: bold;" color="#000000">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</font><br>
                                <font style="font-size: 14pt;font-weight: bold;" color="#000000">RS Jiwa Grhasia Dinas Kesehatan Daerah Istimewa Yogyakarta</font><br>
                                <font style="font-size: 14pt;font-weight: bold;" color="#000000">REGISTER PENGEMBALIAN BELANJA</font><br>
                                @php
                                    use Carbon\Carbon;
                                @endphp
                                <font style="font-size: 14pt;font-weight: bold;" color="#000000">TAHUN ANGGARAN {{ strtoupper(\Carbon\Carbon::parse($tglawal)->format('Y')) }}</font><br>
                                
                                <font style="font-size: 14pt;font-weight: bold;" color="#000000">BULAN {{ strtoupper(\Carbon\Carbon::parse($tglawal)->format('F')) }}</font>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" cellspacing="0" cellpadding="0" border="1" style="margin-top: 10px;">
                        <tr>
                            <td align="center" width="10%">
                                <font style="font-size: 12pt;" color="#000000" >No</font>
                            </td>
                            <td align="center" width="20%">
                                <font style="font-size: 12pt;" color="#000000" >Tanggal</font>
                            </td>
                            <td align="center" width="30%">
                                <font style="font-size: 12pt;" color="#000000" >Uraian</font>
                            </td>
                            <td align="center" width="20%">
                                <font style="font-size: 12pt;" color="#000000" >Kode Rekening</font>
                            </td>
                            <td align="center" width="20%">
                                <font style="font-size: 12pt;" color="#000000" >Nilai</font>
                            </td>
                        </tr>
                        @php
                            $counter = 1;
                        @endphp
                        @foreach ($result['data'] as $item)
                            <tr>
                                <td align="center" width="10%">
                                    <font style="font-size: 12pt;" color="#000000" >{{$counter}}</font>
                                </td>
                                <td align="center" width="20%">
                                    <font style="font-size: 12pt;" color="#000000" >{{$item->tglrealisasi}}</font>
                                </td>
                                <td align="center" width="30%">
                                    <font style="font-size: 12pt;" color="#000000" >{{$item->kegiatan}}</font>
                                </td>
                                <td align="center" width="20%">
                                    <font style="font-size: 12pt;" color="#000000" >{{$item->kodemataanggaran}}</font>
                                </td>
                                <td align="center" width="20%">
                                    <font style="font-size: 12pt;" color="#000000" >{{$item->totalbelanja}}</font>
                                </td>
                            </tr>
                            @php
                                $counter++;
                            @endphp
                        @endforeach
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td width="50%" align="center">
                                <font style="font-size: 12pt;" color="#000000">Mengetahui</font>
                            </td>
                            <td width="50%" align="center">
                                <font style="font-size: 12pt;" color="#000000">Yogyakarta, {{ \Carbon\Carbon::now()->format('d/m/Y') }}</font>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%" align="center">
                                <font style="font-size: 12pt;" color="#000000">{{$jabatanmengetahui}}</font>
                            </td>
                            <td width="50%" align="center">
                                <font style="font-size: 12pt;" color="#000000">{{$jabatanmeminta}}</font>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%" align="center" style="padding-top: 60px;">
                                <font style="font-size: 12pt;" color="#000000">{{$pegawaimengetahui}}</font>
                            </td>
                            <td width="50%" align="center" style="padding-top: 60px;">
                                <font style="font-size: 12pt;" color="#000000">{{$pegawaimeminta}}</font>
                            </td>
                        </tr>
                        {{-- <tr>
                            <td width="50%" align="center">
                                <font style="font-size: 12pt;" color="#000000">NIP. </font>
                            </td>
                            <td width="50%" align="center">
                                <font style="font-size: 12pt;" color="#000000">NIP. </font>
                            </td>
                        </tr> --}}
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<script>
    window.print()
</script>
</body>
</html>