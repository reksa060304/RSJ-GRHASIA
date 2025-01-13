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
        size: auto;   /* auto is the initial value */
        margin: 30;  /* this affects the margin in the printer settings */
    }
</style>
<style>

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }

    .tabel tr td{
        border: 1px solid black;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;
    }
</style>
<body style="background-color: #CCCCCC;">
    <div align="center" >
        <table bgcolor="#FFFFFF" width="{{$pageWidth}}" >
            <tbody >
                <tr>
                    <td align="center" style="width: 200px;">
                        <b style="font-size: 25px;">
                            PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA
                        </b>
                    </td>
                </tr>
                <tr align="center">
                    <td>
                        <b style="font-size: 22px;">LAPORAN REKAPITULASI PER SUB SUB KEGIATAN</b>
                    </td>
                </tr>
            </tbody>
        </table>
        <table bgcolor="#FFFFFF" width="{{$pageWidth}}" >
            <tbody >
                <tr>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:15px; ">SKPD</p>
                    </td>
                    <td></td>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:15px;">:  1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY</p>
                    </td>
                </tr>
                <tr>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">Sub Kegiatan</p>
                    </td>
                    <td></td>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$subsubkegiatan[0]->keterangan3}}</p>
                    </td>
                </tr>
                <tr>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">Sub Sub Kegiatan</p>
                    </td>
                    <td></td>
                    <td align="left">
                        @php
                            $subsubk = explode('-', $subsubkegiatan[0]->keterangan);
                            $lastsubsub = end($subsubk);
                        @endphp
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{ $lastsubsub }}</p>
                    </td>
                </tr>
                <tr>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">Jumlah Anggaran</p>
                    </td>
                    <td></td>
                    <td align="left">
                        @php
                            $jumlahanggaran = 0;
                            
                            foreach ($data as $key => $row) {
                                $jumlahanggaran += $row->totalanggaran;
                            }
                        @endphp
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{ number_format($jumlahanggaran,2,',','.') }}</p>
                    </td>
                </tr>
                <tr>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">Tahun Anggaran</p>
                    </td>
                    <td></td>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$tahunjudul}}</p>
                    </td>
                </tr>
                <tr>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">Bulan</p>
                    </td>
                    <td></td>
                    <td align="left">
                        <p style="text-align: left; font-size: 20px; margin-top:-5px;">: {{$periode}}</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" class="tabel" style="margin-top: 30px;">
            <tr>
                <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold;font-size: 15px; ">KODE REKENING</td>
                <td align="center" width="150" rowspan="2" style="padding: 10px; font-weight: bold;font-size: 15px; ">URAIAN</td>
                <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold; font-size: 15px; ">JUMLAH ANGGARAN</td>
                <td align="center" width="50" colspan="3" style="padding: 10px; font-weight: bold;font-size: 15px;  ">REALISASI GU/TU/UP/LS</td>
                <td align="center" width="50" rowspan="2" style="padding: 10px; font-weight: bold ;font-size: 15px; ">SISA ANGGARAN</td>
            </tr>
            <tr style="border: 1px solid black;">
                <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px;">Bulan lalu</td>
                <td align="center" width="50" style="padding: 10px; font-weight: bold;font-size: 15px; ">Bulan ini</td>
                <td align="center" width="50" style="padding: 10px; font-weight: bold; font-size: 15px; ">Jumlah</td>
            </tr>
            @php
                $kode_mataanggaran1 = null;
                $kode_mataanggaran2 = null;
                $kode_mataanggaran3 = null;
                $kode_mataanggaran = null;

                $string = explode('-', $subsubkegiatan[0]->keterangan);
                $last = end($string);
            @endphp

            <tr style="font-weight: bold;">
                @php
                    $anggaran = 0;
                    $bulanlalu = 0;
                    $bulanini = 0;

                    foreach ($data as $key => $item) {
                        $anggaran += $item->totalanggaran;
                        $bulanlalu += $item->totalspjbulanlalu;
                        $bulanini += $item->totalspjbulanini;
                    }
                @endphp
                <td>{{ $subsubkegiatan[0]->kode }}</td>
                <td>{{ $last }}</td>
                <td>{{ number_format($anggaran,2,'.',',') }}</td>
                <td>{{ number_format($bulanlalu,2,'.',',') }}</td>
                <td>{{ number_format($bulanini,2,'.',',') }}</td>
                <td>{{ number_format($bulanini + $bulanlalu,2,',','.') }}</td>
                <td>{{ number_format($anggaran - ($bulanini + $bulanlalu),2,',','.') }}</td>
            </tr>
            @foreach ($data as $dt)

                @if ($dt->kodemataanggaran1 !== $kode_mataanggaran1)
                    @php
                        $string1 = explode('.',$dt->kodemataanggaran1);
                        $last1 = end($string1);
                        $anggaran1 = 0;
                        $bulanlalu1 = 0;
                        $bulanini1 = 0;

                        foreach ($data as $key => $item) {
                            if($dt->kodemataanggaran1 == $item->kodemataanggaran1){
                                $anggaran1 += $item->totalanggaran;
                                $bulanlalu1 += $item->totalspjbulanlalu;
                                $bulanini1 += $item->totalspjbulanini;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $subsubkegiatan[0]->kode }}.{{ $last1 }}</td>
                        <td>{{ $dt->namamataanggaran1 }}</td>
                        <td>{{ number_format($anggaran1,2,'.',',') }}</td>
                        <td>{{ number_format($bulanlalu1,2,'.',',') }}</td>
                        <td>{{ number_format($bulanini1,2,'.',',') }}</td>
                        <td>{{ number_format($bulanini1 + $bulanlalu1,2,',','.') }}</td>
                        <td>{{ number_format($anggaran1 - ($bulanini1 + $bulanlalu1),2,',','.') }}</td>
                    </tr>
                @endif

                @if ($dt->kodemataanggaran2 !== $kode_mataanggaran2)
                    <tr>
                        @php
                            $string2 = explode('.',$dt->kodemataanggaran2);
                            $last2 = end($string2);
                            $anggaran2 = 0;
                            $bulanlalu2 = 0;
                            $bulanini2 = 0;

                            foreach ($data as $key => $item) {
                                if($dt->kodemataanggaran2 == $item->kodemataanggaran2){
                                    $anggaran2 += $item->totalanggaran;
                                    $bulanlalu2 += $item->totalspjbulanlalu;
                                    $bulanini2 += $item->totalspjbulanini;
                                }
                            }
                        @endphp
                        <td>{{ $subsubkegiatan[0]->kode }}.{{ $last2 }}</td>
                        <td>{{ $dt->namamataanggaran2 }}</td>
                        <td>{{ number_format($anggaran2,2,'.',',') }}</td>
                        <td>{{ number_format($bulanlalu2,2,'.',',') }}</td>
                        <td>{{ number_format($bulanini2,2,'.',',') }}</td>
                        <td>{{ number_format($bulanini2 + $bulanlalu2,2,',','.') }}</td>
                        <td>{{ number_format($anggaran2 - ($bulanini2 + $bulanlalu2),2,',','.') }}</td>
                    </tr>
                @endif

                @if ($dt->kodemataanggaran3 !== $kode_mataanggaran3 && $dt->kodemataanggaran1 !== 'III')
                    @php
                        $string3 = explode('.',$dt->kodemataanggaran3);
                        $last3 = end($string3);
                        $anggaran3 = 0;
                        $bulanlalu3 = 0;
                        $bulanini3 = 0;

                        foreach ($data as $key => $item) {
                            if($dt->kodemataanggaran3 == $item->kodemataanggaran3){
                                $anggaran3 += $item->totalanggaran;
                                $bulanlalu3 += $item->totalspjbulanlalu;
                                $bulanini3 += $item->totalspjbulanini;
                            }
                        }
                    @endphp
                    <tr>
                        <td>{{ $subsubkegiatan[0]->kode }}.{{ $last3 }}</td>
                        <td>{{ $dt->namamataanggaran3 }}</td>
                        <td>{{ number_format($anggaran3,2,'.',',') }}</td>
                        <td>{{ number_format($bulanlalu3,2,'.',',') }}</td>
                        <td>{{ number_format($bulanini3,2,'.',',') }}</td>
                        <td>{{ number_format($bulanini3 + $bulanlalu3,2,',','.') }}</td>
                        <td>{{ number_format($anggaran3 - ($bulanini3 + $bulanlalu3),2,',','.') }}</td>
                    </tr>
                @endif

                @if ($dt->kodemataanggaran !== $kode_mataanggaran)
                    @php
                        $kode_mataanggaran1 = $dt->kodemataanggaran1;
                        $kode_mataanggaran2 = $dt->kodemataanggaran2;
                        $kode_mataanggaran3 = $dt->kodemataanggaran3;
                        $kode_mataanggaran = $dt->kodemataanggaran;

                        $string4 = explode('.',$dt->kodemataanggaran);
                        $last4 = array_slice($string4, -2, 2);
                    @endphp

                    <tr>
                        <td>{{ $subsubkegiatan[0]->kode }}.{{ $last4[0] }}.{{ $last4[1] }}</td>
                        <td>{{ $dt->namamataanggaran }}</td>
                        <td>{{ number_format($dt->totalanggaran,2,'.',',') }}</td>
                        <td>{{ number_format($dt->totalspjbulanlalu,2,'.',',') }}</td>
                        <td>{{ number_format($dt->totalspjbulanini,2,'.',',') }}</td>
                        <td>{{ number_format($dt->jumlah,2,'.',',') }}</td>
                        <td>{{ number_format($dt->sisa,2,'.',',') }}</td>
                    </tr>
                @endif


            @endforeach
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 50px;">
            <tr>
                <td align="center" style="padding: 10px; font-size: 15px; "></td>
                <td align="center" width="350" style="padding: 10px; font-size: 15px; ">Mengetahui</td>
                <td align="center" style="padding: 10px; font-size: 15px; "></td>
                <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Yogyakarta, {{$tanggalcetak}}</td>
                <td align="center" style="padding: 10px; font-size: 15px; "></td>
            </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: -20px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">Pimpinan BLUD RS. Jiwa Grhasia DIY</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Bendahara Pengeluaran</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: 150px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">dr. Akhmad Akhadi Syamsudhuha, M.P.H</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">Paula Sofyanita, SE.</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="margin-top: -20px;">
                <tr>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px; ">NIP. 19680714 200012 1 002</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                    <td align="center" width="350" style="padding: 10px; font-size: 15px;  ">NIP. 19910622 201502 2 002</td>
                    <td align="center" style="padding: 10px; font-size: 15px; "></td>
                </tr>
        </table>
    </div>
<script>
    window.print()
</script>
</body>
</html>