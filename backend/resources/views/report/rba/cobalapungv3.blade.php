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
            margin: 1cm;
        }
        @media print {
            thead {
                display: table-row-group
            }
        }

        p{
            margin: 0;
        }
        table{
            border-collapse: collapse;
            font-size: 10pt;
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
                <th style="width: 15%;" rowspan="2">URAIAN</th>
                <th style="width: 10%" rowspan="2">JUMLAH ANGGARAN</th>
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
            $kodeKegiatan1 = null;
            $kodeKegiatan2 = null;
            $kodeKegiatan3 = null;
            $kodeKegiatan4 = null;
        @endphp
        <tbody>
            @foreach ($data as $item)
                
                {{-- Kegiatan tingkat 1 --}}
                @if ($item->kode_kegiatan1 && ($item->kode_kegiatan1 !== $kodeKegiatan1))

                    @php
                        $anggaranKegiatan1 = 0;
                        $belanjaKegiatan1BulanLalu = 0;
                        $belanjaKegiatan1BulanIni = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->kode_kegiatan1 == $anggaranKegiatan->kode_kegiatan1){
                                $anggaranKegiatan1 = $anggaranKegiatan1 + (int)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($spjbku as $row) {
                            if($item->kode_kegiatan1 == $row->kode_kegiatan1){
                                $belanjaKegiatan1BulanLalu = $belanjaKegiatan1BulanLalu + (int)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan1BulanIni = $belanjaKegiatan1BulanIni + (int)$row->total_belanja_bulan_ini;
                            }
                        }
                    @endphp

                    <tr>
                        <td style="width: 8%;">{{ $item->kode_kegiatan1 }}</td>
                        <td>{{ $item->keterangan_kegiatan1 }}</td>
                        <td style="text-align: right;">{{ number_format($anggaranKegiatan1,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan1BulanLalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan1BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format((int)$belanjaKegiatan1BulanLalu + (int)$belanjaKegiatan1BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($anggaranKegiatan1 - ((int)$belanjaKegiatan1BulanLalu + (int)$belanjaKegiatan1BulanIni)),2,'.',',') }}</td>
                    </tr>
                @endif
                

                {{-- Kegiatan tingkat 2 --}}
                @if ($item->kode_kegiatan2 && ($item->kode_kegiatan2 !== $kodeKegiatan2))
                    
                    @php
                        $anggaranKegiatan2 = 0;
                        $belanjaKegiatan2BulanLalu = 0;
                        $belanjaKegiatan2BulanIni = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->kode_kegiatan2 == $anggaranKegiatan->kode_kegiatan2){
                                $anggaranKegiatan2 = $anggaranKegiatan2 + (float)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($spjbku as $row) {
                            if($item->kode_kegiatan2 == $row->kode_kegiatan2){
                                $belanjaKegiatan2BulanLalu = $belanjaKegiatan2BulanLalu + (float)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan2BulanIni = $belanjaKegiatan2BulanIni + (float)$row->total_belanja_bulan_ini;
                            }
                        }
                    @endphp    

                    <tr style="font-weight: bold;">
                        <td style="width: 8%;">{{ $item->kode_kegiatan2 }}</td>
                        <td>{{ $item->keterangan_kegiatan2 }}</td>
                        <td style="text-align: right;">{{ number_format($anggaranKegiatan2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan2BulanLalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan2BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format((float)$belanjaKegiatan2BulanLalu + (int)$belanjaKegiatan2BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($anggaranKegiatan2 - ((float)$belanjaKegiatan2BulanLalu + (int)$belanjaKegiatan2BulanIni)),2,'.',',') }}</td>
                    </tr>

                    {{-- belanja pegawai --}}
                    <tr>
                        @php
                            $pegawai2 = 0;
                            $pegawai2_bulanlalu = 0;
                            $pegawai2_bulanini = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->idmataanggaranpermen == 102){
                                    $pegawai2 += (float)$anggaranKegiatan->total_anggaran; 
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->idmataanggaranpermen == 102){
                                    $pegawai2_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $pegawai2_bulanini += (float)$row->total_belanja_bulan_ini;
                                }
                            }
                        @endphp
                        <td style="width: 8%;">{{ $item->kode_kegiatan2 }}</td>
                        <td>Belanja Pegawai</td>
                        <td style="text-align: right;">{{ number_format($pegawai2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai2_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai2_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai2_bulanlalu + $pegawai2_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai2 - ($pegawai2_bulanlalu + $pegawai2_bulanini),2,'.',',') }}</td>
                    </tr>

                    {{-- belanja barang dan jasa --}}
                    <tr>
                        @php
                            $barangjasa2 = 0;
                            $barangjasa2_bulanlalu = 0;
                            $barangjasa2_bulanini = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->idmataanggaranpermen == 109){
                                    $barangjasa2 += (float)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->idmataanggaranpermen == 109){
                                    $barangjasa2_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $barangjasa2_bulanini += (float)$row->total_belanja_bulan_ini;
                                }
                            }
                        @endphp
                        <td style="width: 8%;">{{ $item->kode_kegiatan2 }}</td>
                        <td>Belanja Barang dan Jasa</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2_bulanlalu + $barangjasa2_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2 - ($barangjasa2_bulanlalu + $barangjasa2_bulanini),2,'.',',') }}</td>
                    </tr>

                    {{-- belanja modal --}}
                    <tr>
                        @php
                            $belanjaModal2 = 0;
                            $belanjaModal2_bulanlalu = 0;
                            $belanjaModal2_bulanini = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->kode_mataanggaran1 == 'III'){
                                    $belanjaModal2 += (int)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->kode_mataanggaran1 == 'III'){
                                    $belanjaModal2_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $belanjaModal2_bulanini += (float)$row->total_belanja_bulan_ini;
                                }
                            }
                        @endphp
                        <td style="width: 8%;">{{ $item->kode_kegiatan2 }}</td>
                        <td>Belanja Modal</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2_bulanlalu + $belanjaModal2_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2 - ($belanjaModal2_bulanlalu + $belanjaModal2_bulanini),2,'.',',') }}</td>
                    </tr>
                @endif
                

                {{-- Kegiatan tingkat 3 --}}
                @if ($item->kode_kegiatan3 && ($item->kode_kegiatan3 !== $kodeKegiatan3))

                    @php
                        $anggaranKegiatan3 = 0;
                        $belanjaKegiatan3BulanLalu = 0;
                        $belanjaKegiatan3BulanIni = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->kode_kegiatan3 == $anggaranKegiatan->kode_kegiatan3){
                                $anggaranKegiatan3 = $anggaranKegiatan3 + (int)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($spjbku as $row) {
                            if($item->kode_kegiatan3 == $row->kode_kegiatan3){
                                $belanjaKegiatan3BulanLalu = $belanjaKegiatan3BulanLalu + (int)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan3BulanIni = $belanjaKegiatan3BulanIni + (int)$row->total_belanja_bulan_ini;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td style="width: 8%;">{{ $item->kode_kegiatan3 }}</td>
                        <td>{{ $item->keterangan_kegiatan3 }}</td>
                        <td style="text-align: right;">{{ number_format($anggaranKegiatan3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan3BulanLalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan3BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format((int)$belanjaKegiatan3BulanLalu + (int)$belanjaKegiatan3BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($anggaranKegiatan3 - ((int)$belanjaKegiatan3BulanLalu + (int)$belanjaKegiatan3BulanIni)),2,'.',',') }}</td>
                    </tr>

                    {{-- biaya pegawai --}}
                    <tr>
                        @php
                            $pegawai3 = 0;
                            $pegawai3_bulanlalu = 0;
                            $pegawai3_bulanini = 0;
                            
                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->idmataanggaranpermen == 102){
                                    $pegawai3 += (int)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->idmataanggaranpermen == 102){
                                    $pegawai3_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $pegawai3_bulanini += (float)$row->total_belanja_bulan_ini;
                                }
                            }
                        @endphp
                        <td style="width: 8%;">{{ $item->kode_kegiatan3 }}</td>
                        <td>Belanja Pegawai</td>
                        <td style="text-align: right;">{{ number_format($pegawai3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai3_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai3_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai3_bulanlalu + $pegawai3_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai3 - ($pegawai3_bulanlalu + $pegawai3_bulanini),2,'.',',') }}</td>
                    </tr>
                    
                    {{-- barang dan jasa --}}
                    <tr>
                        @php
                            $barangjasa3 = 0;
                            $barangjasa3_bulanlalu = 0;
                            $barangjasa3_bulanini = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->idmataanggaranpermen == 109){
                                    $barangjasa3 += (int)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->idmataanggaranpermen == 109){
                                    $barangjasa3_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $barangjasa3_bulanini += (float)$row->total_belanja_bulan_ini;
                                }
                            }
                        @endphp
                        <td style="width: 8%;">{{ $item->kode_kegiatan3 }}</td>
                        <td>Belanja Barang dan Jasa</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3_bulanlalu + $barangjasa3_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3 - ($barangjasa3_bulanlalu + $barangjasa3_bulanini),2,'.',',') }}</td>
                    </tr>
                    
                    {{-- biaya modal --}}
                    <tr>
                        @php
                            $belanjaModal3 = 0;
                            $belanjaModal3_bulanlalu = 0;
                            $belanjaModal3_bulanini = 0;
                            
                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->kode_mataanggaran1 == 'III'){
                                    $belanjaModal3 += (int)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->kode_mataanggaran1 == 'III'){
                                    $belanjaModal3_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $belanjaModal3_bulanini += (float)$row->total_belanja_bulan_ini;
                                }
                            }
                        @endphp
                        <td style="width: 8%;">{{ $item->kode_kegiatan3 }}</td>
                        <td>Belanja Modal</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3_bulanlalu + $belanjaModal3_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3 - ($belanjaModal3_bulanlalu + $belanjaModal3_bulanini),2,'.',',') }}</td>
                    </tr>
                @endif
                

                {{-- Kegiatan tingkat 4 --}}
                @if ($item->kode_kegiatan && ($item->kode_kegiatan !== $kodeKegiatan4))
                    
                    @php
                        // $arr = explode('-', $item->keterangan_kegiatan);
                        // $ket = end($arr);
                        $anggaranKegiatan4 = 0;
                        $belanjaKegiatanBulanLalu = 0;
                        $belanjaKegiatanBulanIni = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->kode_kegiatan == $anggaranKegiatan->kode_kegiatan){
                                $anggaranKegiatan4 = $anggaranKegiatan4 + (int)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($spjbku as $row) {
                            if($item->kode_kegiatan == $row->kode_kegiatan){
                                $belanjaKegiatanBulanLalu = $belanjaKegiatanBulanLalu + (int)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatanBulanIni = $belanjaKegiatanBulanIni + (int)$row->total_belanja_bulan_ini;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td style="width: 8%;">{{ $item->kode_kegiatan }}</td>
                        <td>{{ $item->keterangan_kegiatan }}</td>
                        <td style="text-align: right;">{{ number_format($anggaranKegiatan4,2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatanBulanLalu,2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatanBulanIni,2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format((int)$belanjaKegiatanBulanLalu + (int)$belanjaKegiatanBulanIni,2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format(($anggaranKegiatan4 - ((int)$belanjaKegiatanBulanLalu + (int)$belanjaKegiatanBulanIni)),2,'.','.') }}</td>
                    </tr>

                @endif
                
                {{-- Mata anggaran --}}
                @if ($item->kode_kegiatan && ($item->kode_kegiatan !== $kodeKegiatan4))

                    @php
                        $kodeKegiatan1 = $item->kode_kegiatan1;
                        $kodeKegiatan2 = $item->kode_kegiatan2;
                        $kodeKegiatan3 = $item->kode_kegiatan3;
                        $kodeKegiatan4 = $item->kode_kegiatan;

                        $kode_mataanggaran1 = null;
                        $kode_mataanggaran2 = null;
                        $kode_mataanggaran3 = null;
                    @endphp

                    @foreach ($data as $ma)
                        @if ($ma->kode_kegiatan == $kodeKegiatan4)

                            {{-- mata anggaran 1 --}}
                            @if ($ma->kode_mataanggaran1 !== $kode_mataanggaran1)
                                @php
                                    $totalRekening1 = 0;
                                    $totalBelanjaBulanLalu1 = 0;
                                    $totalBelanjaBulanIni1 = 0;
                                    $totalBelanja1 = 0;

                                    foreach ($data as $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($ma->kode_mataanggaran1 == $row->kode_mataanggaran1){
                                                $totalRekening1 = (int)$totalRekening1 + (int)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($spjbku as $key => $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($row->kode_mataanggaran1 == $ma->kode_mataanggaran1){
                                                $totalBelanjaBulanLalu1 = $totalBelanjaBulanLalu1 + (int)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni1 = $totalBelanjaBulanIni1 + (int)$row->total_belanja_bulan_ini;
                                                $totalBelanja1 = $totalBelanja1 + (int)$row->total_belanja;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="width: 35%">{{ $ma->kode_mataanggaran1 }}. {{ $ma->nama_mataanggaran1 }}</td>
                                    <td style="text-align: right;">{{ number_format($totalRekening1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanjaBulanLalu1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanjaBulanIni1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanja1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format(((int)$totalRekening1 - (int)$totalBelanja1),2,'.',',') }}</td>
                                </tr>
                                
                                @php
                                    $kode_mataanggaran1 = $ma->kode_mataanggaran1;
                                @endphp
                            @endif
                            
                            {{-- mata anggaran 2 --}}
                            @if ($ma->kode_mataanggaran2 !== $kode_mataanggaran2)
                                @php
                                    $totalRekening2 = 0;
                                    $totalBelanjaBulanLalu2 = 0;
                                    $totalBelanjaBulanIni2 = 0;
                                    $totalBelanja2 = 0;

                                    foreach ($data as $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($ma->kode_mataanggaran2 == $row->kode_mataanggaran2){
                                                $totalRekening2 = (int)$totalRekening2 + (int)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($spjbku as $key => $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($row->kode_mataanggaran2 == $ma->kode_mataanggaran2){
                                                $totalBelanjaBulanLalu2 = $totalBelanjaBulanLalu2 + (int)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni2 = $totalBelanjaBulanIni2 + (int)$row->total_belanja_bulan_ini;
                                                $totalBelanja2 = $totalBelanja2 + (int)$row->total_belanja;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="width: 35%; padding-left: 1.7em;">
                                        @php
                                            $split = explode('.', $ma->kode_mataanggaran2);
                                            $kode = end($split);
                                        @endphp
                                        {{ $kode }}. {{ $ma->nama_mataanggaran2 }}
                                    </td>
                                    <td style="text-align: right;">{{ number_format($totalRekening2,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanjaBulanLalu2,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanjaBulanIni2,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanja2,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format(((int)$totalRekening2 - (int)$totalBelanja2),2,'.',',') }}</td>
                                </tr>
                                
                                @php
                                    $kode_mataanggaran2 = $ma->kode_mataanggaran2;
                                @endphp
                            @endif

                            {{-- mata anggaran 3 --}}
                            @if ($ma->kode_mataanggaran3 !== $kode_mataanggaran3 && $ma->kode_mataanggaran1 !== 'III')
                                @php
                                    $totalRekening3 = 0;
                                    $totalBelanjaBulanLalu3 = 0;
                                    $totalBelanjaBulanIni3 = 0;
                                    $totalBelanja3 = 0;

                                    foreach ($data as $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($ma->kode_mataanggaran3 == $row->kode_mataanggaran3){
                                                $totalRekening3 = (int)$totalRekening3 + (int)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($spjbku as $key => $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($row->kode_mataanggaran3 == $ma->kode_mataanggaran3){
                                                $totalBelanjaBulanLalu3 = $totalBelanjaBulanLalu3 + (int)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni3 = $totalBelanjaBulanIni3 + (int)$row->total_belanja_bulan_ini;
                                                $totalBelanja3 = $totalBelanja3 + (int)$row->total_belanja;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="width: 35%; padding-left: 3em;">
                                        @php
                                            $split = explode('.', $ma->kode_mataanggaran3);
                                            $kode = end($split);
                                        @endphp
                                        {{ $kode }}. {{ $ma->nama_mataanggaran3 }}
                                    </td>
                                    <td style="text-align: right;">{{ number_format($totalRekening3,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanjaBulanLalu3,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanjaBulanIni3,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanja3,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format(((int)$totalRekening3 - (int)$totalBelanja3),2,'.',',') }}</td>
                                </tr>
                                
                                @php
                                    $kode_mataanggaran3 = $ma->kode_mataanggaran3;
                                @endphp
                            @endif

                            {{-- mata anggaran 4 --}}
                            @php
                                $totalBulanLalu = 0;
                                $totalBulanIni = 0;
                                $totalBelanja = 0;

                                foreach ($spjbku as $key => $row) {
                                    if($row->kode_kegiatan == $ma->kode_kegiatan){
                                        if($row->kode_mataanggaran == $ma->kode_mataanggaran){
                                            $totalBulanLalu = $row->total_belanja_bulan_lalu;
                                            $totalBulanIni = $row->total_belanja_bulan_ini;
                                            $totalBelanja = $row->total_belanja;
                                        }
                                    }
                                }
                            @endphp

                            <tr>
                                <td></td>
                                <td style="width: 35%; padding-left:4em;">
                                    @php
                                        $split = explode('.', $ma->kode_mataanggaran);
                                        $kode = array_slice($split, -2, 2);
                                    @endphp
                                    {{ $kode[0] }}.{{ $kode[1] }}. {{ $ma->nama_mataanggaran }}
                                </td>
                                <td style="text-align: right;">{{ number_format($ma->total_anggaran,2,'.',',') }}</td>
                                <td style="text-align: right;">{{ number_format($totalBulanLalu,2,'.',',') }}</td>
                                <td style="text-align: right;">{{ number_format($totalBulanIni,2,'.',',') }}</td>
                                <td style="text-align: right;">{{ number_format($totalBelanja,2,'.',',') }}</td>
                                <td style="text-align: right;">{{ number_format(((int)$ma->total_anggaran - (int)$totalBelanja),2,'.',',') }}</td>
                            </tr>
                        @endif
                    @endforeach

                @endif
            @endforeach

            {{-- spjbruto --}}
            <tr>
                @php
                    $bruto_anggaran = 0;
                    $bruto_bulanlalu = 0;
                    $bruto_bulanini = 0;

                    foreach ($data as $key => $item) {
                        $bruto_anggaran += (float)$item->total_anggaran;
                    }

                    foreach ($spjbku as $key => $row) {
                        $bruto_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                        $bruto_bulanini += (float)$row->total_belanja_bulan_ini;
                    }
                @endphp
                <td colspan="2" style="padding-top: 3em; border: none; font-weight: bold; font-size: 14pt;">
                    SPJ BRUTO
                </td>
                <td style="padding-top: 3em; border: none; text-align: right;">{{ number_format($bruto_anggaran,2,'.',',') }}</td>
                <td style="padding-top: 3em; border: none; text-align: right;">{{ number_format($bruto_bulanlalu,2,'.',',') }}</td>
                <td style="padding-top: 3em; border: none; text-align: right;">{{ number_format($bruto_bulanini,2,'.',',') }}</td>
                <td style="padding-top: 3em; border: none; text-align: right;">{{ number_format($bruto_bulanlalu + $bruto_bulanini,2,'.',',') }}</td>
            </tr>

            {{-- belanja pegawai --}}
            <tr>
                @php
                    $pegawai_angg = 0;
                    $pegawai_bulanlalu = 0;
                    $pegawai_bulanini = 0;

                    foreach ($data as $key => $item) {
                        if($item->idmataanggaranpermen == 102){
                            $pegawai_angg += (float)$item->total_anggaran; 
                        }
                    }

                    foreach ($spjbku as $key => $row) {
                        if($row->idmataanggaranpermen == 102){
                            $pegawai_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                            $pegawai_bulanini += (float)$row->total_belanja_bulan_ini;
                        }
                    }
                @endphp
                <td colspan="2" style="border: none;">
                    Belanja Pegawai
                </td>
                <td style="border: none; text-align: right;">{{ number_format($pegawai_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($pegawai_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($pegawai_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($pegawai_bulanlalu + $bruto_bulanini,2,'.',',') }}</td>
            </tr>

            {{-- belanja barang dan jasa --}}
            <tr>
                @php
                    $barangjasa_angg = 0;
                    $barangjasa_bulanlalu = 0;
                    $barangjasa_bulanini = 0;

                    foreach ($data as $key => $item) {
                        if($item->idmataanggaranpermen == 109){
                            $barangjasa_angg += (float)$item->total_anggaran; 
                        }
                    }

                    foreach ($spjbku as $key => $row) {
                        if($row->idmataanggaranpermen == 109){
                            $barangjasa_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                            $barangjasa_bulanini += (float)$row->total_belanja_bulan_ini;
                        }
                    }
                @endphp
                <td colspan="2" style="border: none;">
                    Barang dan Jasa
                </td>
                <td style="border: none; text-align: right;">{{ number_format($barangjasa_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($barangjasa_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($barangjasa_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($barangjasa_bulanlalu + $bruto_bulanini,2,'.',',') }}</td>
            </tr>

            {{-- belanja Modal PM --}}
            <tr>
                @php
                    $modalpm_angg = 0;
                    $modalpm_bulanlalu = 0;
                    $modalpm_bulanini = 0;

                    foreach ($data as $key => $item) {
                        if($item->kode_mataanggaran2 == 'III.2'){
                            $modalpm_angg += (float)$item->total_anggaran; 
                        }
                    }

                    foreach ($spjbku as $key => $row) {
                        if($row->kode_mataanggaran2 == 'III.2'){
                            $modalpm_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                            $modalpm_bulanini += (float)$row->total_belanja_bulan_ini;
                        }
                    }
                @endphp
                <td colspan="2" style="border: none;">
                    Belanja Modal PM
                </td>
                <td style="border: none; text-align: right;">{{ number_format($modalpm_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalpm_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalpm_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalpm_bulanlalu + $bruto_bulanini,2,'.',',') }}</td>
            </tr>

            {{-- belanja Modal Gedung dan Bangunan --}}
            <tr>
                @php
                    $modalgb_angg = 0;
                    $modalgb_bulanlalu = 0;
                    $modalgb_bulanini = 0;

                    foreach ($data as $key => $item) {
                        if($item->kode_mataanggaran2 == 'III.3'){
                            $modalgb_angg += (float)$item->total_anggaran; 
                        }
                    }

                    foreach ($spjbku as $key => $row) {
                        if($row->kode_mataanggaran2 == 'III.3'){
                            $modalgb_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                            $modalgb_bulanini += (float)$row->total_belanja_bulan_ini;
                        }
                    }
                @endphp
                <td colspan="2" style="border: none;">
                    Belanja Modal Gedung Bangunan
                </td>
                <td style="border: none; text-align: right;">{{ number_format($modalgb_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalgb_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalgb_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalgb_bulanlalu + $bruto_bulanini,2,'.',',') }}</td>
            </tr>

            {{-- belanja Modal Gedung dan Bangunan --}}
            <tr>
                @php
                    $atb_angg = 0;
                    $atb_bulanlalu = 0;
                    $atb_bulanini = 0;

                    foreach ($data as $key => $item) {
                        if($item->kode_mataanggaran2 == 'III.6'){
                            $atb_angg += (float)$item->total_anggaran; 
                        }
                    }

                    foreach ($spjbku as $key => $row) {
                        if($row->kode_mataanggaran2 == 'III.6'){
                            $atb_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                            $atb_bulanini += (float)$row->total_belanja_bulan_ini;
                        }
                    }
                @endphp
                <td colspan="2" style="border: none;">
                    Belanja Modal ATB
                </td>
                <td style="border: none; text-align: right;">{{ number_format($atb_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($atb_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($atb_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($atb_bulanlalu + $bruto_bulanini,2,'.',',') }}</td>
            </tr>

            {{-- Pengembalian --}}
            <tr>
                <td colspan="2" style="border: none; font-weight: bold; font-size: 14pt;">
                    Pengembalian Belanja
                </td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
            </tr>

            {{-- belanja pegawai --}}
            <tr>
                <td colspan="2" style="border: none;">
                    Belanja Pegawai
                </td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
            </tr>

            {{-- belanja barang dan jasa --}}
            <tr>
                <td colspan="2" style="border: none;">
                    Barang dan Jasa
                </td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
            </tr>
            
            {{-- belanja Modal PM --}}
            <tr>
                <td colspan="2" style="border: none;">
                    Belanja Modal PM
                </td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
            </tr>

            {{-- belanja Modal Gedung dan Bangunan --}}
            <tr>
                <td colspan="2" style="border: none;">
                    Belanja Modal Gedung Bangunan
                </td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
            </tr>

            {{-- belanja Modal Gedung dan Bangunan --}}
            <tr>
                <td colspan="2" style="border: none;">
                    Belanja Modal ATB
                </td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
                <td style="border: none; text-align: right;">0</td>
            </tr>


            {{-- START - PENERIMAAN --}}
                <tr>
                    <td colspan="2" style="font-weight:bold; padding-top:3em; border:none;">PENERIMAAN : </td>
                </tr>

                {{-- transfer bendahara penerimaan --}}
                <tr>
                    
                    <td colspan="2" style="font-weight:bold; border: none;">  - Transfer Bendahara Penerima</td>  
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format(0,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format(0,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format(0 + 0,2,'.',',') }}</td>
                </tr>

                {{-- jasa giro --}}
                <tr>
                    <td colspan="2" style="font-weight:bold; border: none;"> - Jasa Giro</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format(0,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format(0,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format(0 + 0,2,'.',',') }}</td>
                </tr>

                {{-- pajak --}}
                <tr>
                    @php
                        $totalpajakpenerimaan_bulanlalu = 0;
                        $totalpajakpenerimaan_bulanini = 0;
                        
                        foreach ($pajakpenerimaan as $pjpen) {
                            $totalpajakpenerimaan_bulanlalu += $pjpen->total_belanja_bulan_lalu;
                            $totalpajakpenerimaan_bulanini += $pjpen->total_belanja_bulan_ini;
                        }
                    @endphp
                    <td colspan="2" style="font-weight:bold; border: none;"> - Potongan pajak:</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format(0,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format(0,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format(0 + 0,2,'.',',') }}</td>
                </tr>
                @foreach ($pajakpenerimaan as $pjpen)
                    <tr>
                        <td colspan="2" style="font-weight:bold; border: none; padding-left: 2em;"> - {{ $pjpen->namaexternal }}:</td>
                        <td style="border: none;"></td>
                        <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($pjpen->total_belanja_bulan_lalu,2,'.',',') }}</td>
                        <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($pjpen->total_belanja_bulan_ini,2,'.',',') }}</td>
                        <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($pjpen->total_belanja_bulan_lalu + $pjpen->total_belanja_bulan_ini,2,'.',',') }}</td>
                    </tr>
                @endforeach
            {{-- END - PENERIMAAN --}}


            {{-- START PENGELUARAN --}}
                <tr>
                    <td colspan="2" style="font-weight:bold; padding-top:3em; border:none;">PENGELUARAN : </td>
                </tr>

                {{-- spj --}}
                <tr>
                    @php
                        $spj_pengeluaran_bulan_lalu = 0;
                        $spj_pengeluaran_bulan_ini = 0;

                        foreach ($spjbku as $key => $item) {
                            $spj_pengeluaran_bulan_lalu += (float)$item->total_belanja_bulan_lalu;
                            $spj_pengeluaran_bulan_ini += (float)$item->total_belanja_bulan_ini;
                        }
                        
                    @endphp
                    <td colspan="2" style="font-weight:bold; border: none;">  - SPJ</td>  
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($spj_pengeluaran_bulan_lalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($spj_pengeluaran_bulan_ini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($spj_pengeluaran_bulan_lalu + $spj_pengeluaran_bulan_ini,2,'.',',') }}</td>
                </tr>

                {{-- jasa giro --}}
                <tr>
                    <td colspan="2" style="font-weight:bold; border: none;"> - Jasa Giro</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format(0,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format(0,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format(0 + 0,2,'.',',') }}</td>
                </tr>

                {{-- pajak --}}
                <tr>
                    @php
                        $totalpajakpengeluaran_bulanlalu = 0;
                        $totalpajakpengeluaran_bulanini = 0;
                        
                        foreach ($pajakpengeluaran as $pjpeng) {
                            $totalpajakpengeluaran_bulanlalu += $pjpeng->total_belanja_bulan_lalu;
                            $totalpajakpengeluaran_bulanini += $pjpeng->total_belanja_bulan_ini;
                        }
                    @endphp

                    <td colspan="2" style="font-weight:bold; border: none;"> - Penyetoran pajak:</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpengeluaran_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpengeluaran_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpengeluaran_bulanlalu + $totalpajakpengeluaran_bulanini,2,'.',',') }}</td>
                </tr>
                @foreach ($pajakpengeluaran as $pjpeng)
                    <tr>
                        <td colspan="2" style="font-weight:bold; border: none; padding-left: 2em;"> - {{ $pjpeng->namaexternal }}:</td>
                        <td style="border: none;"></td>
                        <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($pjpeng->total_belanja_bulan_lalu,2,'.',',') }}</td>
                        <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($pjpeng->total_belanja_bulan_ini,2,'.',',') }}</td>
                        <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($pjpeng->total_belanja_bulan_lalu + $pjpeng->total_belanja_bulan_ini,2,'.',',') }}</td>
                    </tr>
                @endforeach
            {{-- END PENGELUARAN --}}
        </tbody>
    </table>
</body>
</html>