<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Laporan Fungsional</title>
    
    <style>
        @page {
            size: 33cm 21.5cm;
            margin: 1.5cm 2cm 4cm 1.9cm 
        }

        p{
            margin: 0;
        }
        table{
            border-collapse: collapse;
        }
        table tr th,td{
            border: 1px solid black;
            padding: 0.3em 0.6em;
        }
    </style>
</head>
<body style="width:100%;">

    <table style="width:50%; margin-left:auto; margin-right:auto;">
        <tbody >
            <tr>
                <td style="text-align:center; border:none;">
                    <b style="font-size: 22px;">
                        PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA<br>
                        LAPORAN PERTANGGUNGJAWABAN BENDAHARA PENGELUARAN<br>
                        (SPJ BELANJA - FUNGSIONAL)<br>
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
    
    <table style="width:50%; margin-left:auto; margin-right:auto;">
        <tbody >
            <tr>
                <td align="left" style="border:none;">
                    <p style="text-align: left; margin-top:15px;">SKPD</p>
                </td>
                <td align="left" style="border:none;">
                    <p style="text-align: left; margin-top:15px;">: 1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY</p>
                </td>
            </tr>
            <tr>
                <td align="left" style="border:none;">
                    <p style="text-align: left; margin-top:-5px;">Kuasa Pengguna Anggaran</p>
                </td>
                <td align="left" style="border:none;">
                    <p style="text-align: left; margin-top:-5px;">: dr. Akhmad Akhadi Syamsudhuha, M.P.H</p>
                </td>
            </tr>
            <tr>
                <td align="left" style="border:none;">
                    <p style="text-align: left; margin-top:-5px;">Bendahara</p>
                </td>
                <td align="left" style="border:none;">
                    <p style="text-align: left; margin-top:-5px;">: Paula Sofyanita, SE.</p>
                </td>
            </tr>
            <tr>
                <td align="left" style="border:none;">
                    <p style="text-align: left; margin-top:-5px;">Tahun Anggaran</p>
                </td>
                <td align="left" style="border:none;">
                    {{-- <p style="text-align: left; margin-top:-5px;">: {{$tahun}}</p> --}}
                </td>
            </tr>
            <tr>
                <td align="left" style="border:none;">
                    <p style="text-align: left; margin-top:-5px; border:none;">Periode s/d</p>
                </td>
                <td align="left" style="border:none;">
                    {{-- <p style="text-align: left; margin-top:-5px;">: {{substr($tanggaljudul, 0, -5)}}</p> --}}
                </td>
            </tr>
        </tbody>
    </table>

    <table style="width:100%;">
        <thead>
            <tr>
                <th rowspan="2">KODE REKENING</th>
                <th rowspan="2">URAIAN</th>
                <th rowspan="2">JUMLAH ANGGARAN</th>
                <th colspan="3">REALISASI GU/TU/UP/LS</th>
                <th rowspan="2">Sisa Anggaran</th>
            </tr>
            <tr>
                <th>Bulan lalu</th>
                <th>Bulan ini</th>
                <th>Jumlah</th>
            </tr>
        </thead>

        @php
            $idKegiatan1 = null;
            $idKegiatan2 = null;
            $idKegiatan3 = null;
            $idKegiatan4 = null;
        @endphp
        <tbody>
            @foreach ($data as $item)
                
                {{-- Kegiatan tingkat 1 --}}
                @if ($item->id_kegiatan1 && ($item->id_kegiatan1 !== $idKegiatan1))

                    @php
                        $anggaranKegiatan1 = 0;
                        $belanjaKegiatan1BulanLalu = 0;
                        $belanjaKegiatan1BulanIni = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->id_kegiatan1 == $anggaranKegiatan->id_kegiatan1){
                                $anggaranKegiatan1 = $anggaranKegiatan1 + (int)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($lapung as $row) {
                            if($item->id_kegiatan1 == $row->id_kegiatan1){
                                $belanjaKegiatan1BulanLalu = $belanjaKegiatan1BulanLalu + (int)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan1BulanIni = $belanjaKegiatan1BulanIni + (int)$row->total_belanja_bulan_ini;
                            }
                        }
                    @endphp

                    <tr>
                        <td style="width: 8%;">{{ $item->kode_kegiatan1 }}</td>
                        <td>{{ $item->keterangan_kegiatan1 }}</td>
                        <td style="background-color: #40A578; text-align: right;">Rp. {{ number_format($anggaranKegiatan1,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($belanjaKegiatan1BulanLalu,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($belanjaKegiatan1BulanIni,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format((int)$belanjaKegiatan1BulanLalu + (int)$belanjaKegiatan1BulanIni,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format(($anggaranKegiatan1 - ((int)$belanjaKegiatan1BulanLalu + (int)$belanjaKegiatan1BulanIni)),2,',','.') }}</td>
                    </tr>
                @endif
                

                {{-- Kegiatan tingkat 2 --}}
                @if ($item->id_kegiatan2 && ($item->id_kegiatan2 !== $idKegiatan2))
                    
                    @php
                        $anggaranKegiatan2 = 0;
                        $belanjaKegiatan2BulanLalu = 0;
                        $belanjaKegiatan2BulanIni = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->id_kegiatan2 == $anggaranKegiatan->id_kegiatan2){
                                $anggaranKegiatan2 = $anggaranKegiatan2 + (int)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($lapung as $row) {
                            if($item->id_kegiatan2 == $row->id_kegiatan2){
                                $belanjaKegiatan2BulanLalu = $belanjaKegiatan2BulanLalu + (int)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan2BulanIni = $belanjaKegiatan2BulanIni + (int)$row->total_belanja_bulan_ini;
                            }
                        }
                    @endphp    

                    <tr>
                        <td style="width: 8%;">{{ $item->kode_kegiatan2 }}</td>
                        <td>{{ $item->keterangan_kegiatan2 }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($anggaranKegiatan2,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($belanjaKegiatan2BulanLalu,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($belanjaKegiatan2BulanIni,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format((int)$belanjaKegiatan2BulanLalu + (int)$belanjaKegiatan2BulanIni,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format(($anggaranKegiatan2 - ((int)$belanjaKegiatan2BulanLalu + (int)$belanjaKegiatan2BulanIni)),2,',','.') }}</td>
                    </tr>
                @endif
                

                {{-- Kegiatan tingkat 3 --}}
                @if ($item->id_kegiatan3 && ($item->id_kegiatan3 !== $idKegiatan3))

                    @php
                        $anggaranKegiatan3 = 0;
                        $belanjaKegiatan3BulanLalu = 0;
                        $belanjaKegiatan3BulanIni = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->id_kegiatan3 == $anggaranKegiatan->id_kegiatan3){
                                $anggaranKegiatan3 = $anggaranKegiatan3 + (int)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($lapung as $row) {
                            if($item->id_kegiatan3 == $row->id_kegiatan3){
                                $belanjaKegiatan3BulanLalu = $belanjaKegiatan3BulanLalu + (int)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan3BulanIni = $belanjaKegiatan3BulanIni + (int)$row->total_belanja_bulan_ini;
                            }
                        }
                    @endphp
                    <tr>
                        <td style="width: 8%;">{{ $item->kode_kegiatan3 }}</td>
                        <td>{{ $item->keterangan_kegiatan3 }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($anggaranKegiatan3,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($belanjaKegiatan3BulanLalu,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($belanjaKegiatan3BulanIni,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format((int)$belanjaKegiatan3BulanLalu + (int)$belanjaKegiatan3BulanIni,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format(($anggaranKegiatan3 - ((int)$belanjaKegiatan3BulanLalu + (int)$belanjaKegiatan3BulanIni)),2,',','.') }}</td>
                    </tr>
                @endif
                

                {{-- Kegiatan tingkat 4 --}}
                @if ($item->id_kegiatan && ($item->id_kegiatan !== $idKegiatan4))
                    
                    @php
                        $arr = explode('-', $item->keterangan_kegiatan);
                        $ket = end($arr);
                        $anggaranKegiatan4 = 0;
                        $belanjaKegiatanBulanLalu = 0;
                        $belanjaKegiatanBulanIni = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->id_kegiatan == $anggaranKegiatan->id_kegiatan){
                                $anggaranKegiatan4 = $anggaranKegiatan4 + (int)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($lapung as $row) {
                            if($item->id_kegiatan == $row->id_kegiatan){
                                $belanjaKegiatanBulanLalu = $belanjaKegiatanBulanLalu + (int)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatanBulanIni = $belanjaKegiatanBulanIni + (int)$row->total_belanja_bulan_ini;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td style="width: 8%;">{{ $item->kode_kegiatan }}</td>
                        <td>{{ $ket }}</td>
                        <td style="background-color: #9DDE8B; text-align: right;">Rp. {{ number_format($anggaranKegiatan4,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($belanjaKegiatanBulanLalu,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format($belanjaKegiatanBulanIni,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format((int)$belanjaKegiatanBulanLalu + (int)$belanjaKegiatanBulanIni,2,',','.') }}</td>
                        <td style="text-align: right;">Rp. {{ number_format(($anggaranKegiatan4 - ((int)$belanjaKegiatanBulanLalu + (int)$belanjaKegiatanBulanIni)),2,',','.') }}</td>
                    </tr>

                @endif
                
                {{-- Mata anggaran --}}
                @if ($item->id_kegiatan && ($item->id_kegiatan !== $idKegiatan4))

                    @php
                        $idKegiatan1 = $item->id_kegiatan1;
                        $idKegiatan2 = $item->id_kegiatan2;
                        $idKegiatan3 = $item->id_kegiatan3;
                        $idKegiatan4 = $item->id_kegiatan;

                        $idRekening1 = null;
                        $idRekening2 = null;
                        $idRekening3 = null;
                    @endphp

                    @foreach ($data as $ma)
                        @if ($ma->id_kegiatan == $idKegiatan4)

                            {{-- mata anggaran 1 --}}
                            @if ($ma->id_mataanggaran1 !== $idRekening1)
                                @php
                                    $totalRekening1 = 0;
                                    $totalBelanjaBulanLalu1 = 0;
                                    $totalBelanjaBulanIni1 = 0;
                                    $totalBelanja1 = 0;

                                    foreach ($data as $row) {
                                        if($row->id_kegiatan == $ma->id_kegiatan){
                                            if($ma->id_mataanggaran1 == $row->id_mataanggaran1){
                                                $totalRekening1 = (int)$totalRekening1 + (int)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($lapung as $key => $row) {
                                        if($row->id_kegiatan == $ma->id_kegiatan){
                                            if($row->id_mataanggaran1 == $ma->id_mataanggaran1){
                                                $totalBelanjaBulanLalu1 = $totalBelanjaBulanLalu1 + (int)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni1 = $totalBelanjaBulanIni1 + (int)$row->total_belanja_bulan_ini;
                                                $totalBelanja1 = $totalBelanja1 + (int)$row->total_belanja;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="width: 35%">
                                        <div style="width: 100%; display: inline-flex">
                                            <p style="width: 15%">{{ $ma->kode_mataanggaran1 }}</p>
                                            <p style="width: 85%">{{ $ma->nama_mataanggaran1 }}</p>
                                        </div>
                                    </td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalRekening1,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanjaBulanLalu1,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanjaBulanIni1,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanja1,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format(((int)$totalRekening1 - (int)$totalBelanja1),2,',','.') }}</td>
                                </tr>
                                
                                @php
                                    $idRekening1 = $ma->id_mataanggaran1;
                                @endphp
                            @endif

                            
                            {{-- mata anggaran 2 --}}
                            @if ($ma->id_mataanggaran2 !== $idRekening2)
                                @php
                                    $totalRekening2 = 0;
                                    $totalBelanjaBulanLalu2 = 0;
                                    $totalBelanjaBulanIni2 = 0;
                                    $totalBelanja2 = 0;

                                    foreach ($data as $row) {
                                        if($row->id_kegiatan == $ma->id_kegiatan){
                                            if($ma->id_mataanggaran2 == $row->id_mataanggaran2){
                                                $totalRekening2 = (int)$totalRekening2 + (int)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($lapung as $key => $row) {
                                        if($row->id_kegiatan == $ma->id_kegiatan){
                                            if($row->id_mataanggaran2 == $ma->id_mataanggaran2){
                                                $totalBelanjaBulanLalu2 = $totalBelanjaBulanLalu2 + (int)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni2 = $totalBelanjaBulanIni2 + (int)$row->total_belanja_bulan_ini;
                                                $totalBelanja2 = $totalBelanja2 + (int)$row->total_belanja;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="width: 35%">
                                        <div style="width: 100%; display: inline-flex">
                                            <p style="width: 15%">{{ $ma->kode_mataanggaran2 }}</p>
                                            <p style="width: 85%">{{ $ma->nama_mataanggaran2 }}</p>
                                        </div>
                                    </td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalRekening2,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanjaBulanLalu2,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanjaBulanIni2,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanja2,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format(((int)$totalRekening2 - (int)$totalBelanja2),2,',','.') }}</td>
                                </tr>
                                
                                @php
                                    $idRekening2 = $ma->id_mataanggaran2;
                                @endphp
                            @endif


                            {{-- mata anggaran 3 --}}
                            @if ($ma->id_mataanggaran3 !== $idRekening3)
                                @php
                                    $totalRekening3 = 0;
                                    $totalBelanjaBulanLalu3 = 0;
                                    $totalBelanjaBulanIni3 = 0;
                                    $totalBelanja3 = 0;

                                    foreach ($data as $row) {
                                        if($row->id_kegiatan == $ma->id_kegiatan){
                                            if($ma->id_mataanggaran3 == $row->id_mataanggaran3){
                                                $totalRekening3 = (int)$totalRekening3 + (int)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($lapung as $key => $row) {
                                        if($row->id_kegiatan == $ma->id_kegiatan){
                                            if($row->id_mataanggaran3 == $ma->id_mataanggaran3){
                                                $totalBelanjaBulanLalu3 = $totalBelanjaBulanLalu3 + (int)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni3 = $totalBelanjaBulanIni3 + (int)$row->total_belanja_bulan_ini;
                                                $totalBelanja3 = $totalBelanja3 + (int)$row->total_belanja;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="width: 35%">
                                        <div style="width: 100%; display: inline-flex">
                                            <p style="width: 15%">{{ $ma->kode_mataanggaran3 }}</p>
                                            <p style="width: 85%">{{ $ma->nama_mataanggaran3 }}</p>
                                        </div>
                                    </td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalRekening3,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanjaBulanLalu3,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanjaBulanIni3,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format($totalBelanja3,2,',','.') }}</td>
                                    <td style="text-align: right;">Rp. {{ number_format(((int)$totalRekening3 - (int)$totalBelanja3),2,',','.') }}</td>
                                </tr>
                                
                                @php
                                    $idRekening3 = $ma->id_mataanggaran3;
                                @endphp
                            @endif
                            

                            {{-- mata anggaran 4 --}}
                            @php
                                $totalBulanLalu = 0;
                                $totalBulanIni = 0;
                                $totalBelanja = 0;

                                foreach ($lapung as $key => $row) {
                                    if($row->id_kegiatan == $ma->id_kegiatan){
                                        if($row->id_mataanggaran == $ma->id_mataanggaran){
                                            $totalBulanLalu = $row->total_belanja_bulan_lalu;
                                            $totalBulanIni = $row->total_belanja_bulan_ini;
                                            $totalBelanja = $row->total_belanja;
                                        }
                                    }
                                }
                            @endphp

                            <tr style="font-weight: bold;">
                                <td></td>
                                <td style="width: 35%">
                                    <div style="width: 100%; display: inline-flex">
                                        <p style="width: 15%">{{ $ma->kode_mataanggaran }}</p>
                                        <p style="width: 85%">{{ $ma->nama_mataanggaran }}</p>
                                    </div>
                                </td>
                                <td style="background-color: #E6FF94; text-align: right;">Rp. {{ number_format($ma->total_anggaran,2,',','.') }}</td>
                                <td style="text-align: right;">Rp. {{ number_format($totalBulanLalu,2,',','.') }}</td>
                                <td style="text-align: right;">Rp. {{ number_format($totalBulanIni,2,',','.') }}</td>
                                <td style="text-align: right;">Rp. {{ number_format($totalBelanja,2,',','.') }}</td>
                                <td style="text-align: right;">Rp. {{ number_format(((int)$ma->total_anggaran - (int)$totalBelanja),2,',','.') }}</td>
                            </tr>
                        @endif
                    @endforeach

                @endif
            @endforeach
        </tbody>
    </table>

</body>
</html>