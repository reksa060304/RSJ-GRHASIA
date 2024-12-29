<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Laporan Fungsional</title>
    
    <style>
        @page {
            size: 35.6cm 21.6cm;
            margin: 1cm;
            font-family: Arial, Helvetica, sans-serif;
        }
        @media print {
            /* thead {
                display: table-row-group
            } */
        }

        p{
            margin: 0;
        }
        table{
            table-layout: fixed;
            border-collapse: collapse;
            font-size: 8.5pt;
        }
        table tr th,td{
            border: 1px solid black;
            overflow: hidden; 
            text-overflow: ellipsis; 
            word-wrap: break-word;
        }
    </style>
</head>
<body>

    <table style="width:50%; margin-left:auto; margin-right:auto;">
        <tbody >
            <tr>
                <td style="text-align:center; border:none;">
                    <b>
                        <span style="font-size: 14pt;">
                            PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA
                        </span>
                        <br>
                        <span style="font-size: 12pt;">
                            LAPORAN PERTANGGUNGJAWABAN BENDAHARA PENGELUARAN<br>
                            (SPJ BELANJA - FUNGSIONAL)<br>
                        </span>
                    </b>
                </td>
            </tr>
        </tbody>
    </table>
    
    <table style="font-size:10pt; font-weight:bold; margin-top:.3cm;">
        <tbody >
            <tr>
                <td align="left" style="border:none;">SKD</td>
                <td align="left" style="border:none;">: 1.02.2.22.0.00.01.0004 - RS Jiwa GRHASIA DINKES DIY</td>
            </tr>
            <tr>
                <td align="left" style="border:none;">Kuasa Pengguna Anggaran</td>
                <td align="left" style="border:none;">: dr. Akhmad Akhadi Syamsudhuha, M.P.H</p></td>
            </tr>
            <tr>
                <td align="left" style="border:none;">Bendahara</td>
                <td align="left" style="border:none;">: Paula Sofyanita, SE.</td>
            </tr>
            <tr>
                <td align="left" style="border:none;">Tahun Anggaran</td>
                <td align="left" style="border:none;">: {{ $setting->tahunanggaran }}</td>
            </tr>
            <tr>
                <td align="left" style="border:none;">Periode s/d</td>
                <td align="left" style="border:none;"></td>
            </tr>
        </tbody>
    </table>

    <table id="isi" style="margin-top: .3cm;">
        <thead>
            <tr>
                <th rowspan="2">KODE REKENING</th>
                <th rowspan="2" style="width:auto;">URAIAN</th>
                <th rowspan="2">JUMLAH ANGGARAN</th>
                <th colspan="3">REALISASI GU/TU/UP/LS</th>
                <th rowspan="2">Sisa Anggaran</th>
                <th rowspan="2">PENGEMBALIAN BELANJA</th>
                <th rowspan="2">PENGELUARAN BELANJA BERSIH</th>
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
                        $totalPengembalianKegiatan1 = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->kode_kegiatan1 == $anggaranKegiatan->kode_kegiatan1){
                                $anggaranKegiatan1 += (float)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($spjbku as $row) {
                            if($item->kode_kegiatan1 == $row->kode_kegiatan1){
                                $belanjaKegiatan1BulanLalu += (float)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan1BulanIni += (float)$row->total_belanja_bulan_ini;
                                $totalPengembalianKegiatan1 += $row->totalpengembalian;
                            }
                        }
                    @endphp

                    <tr>
                        <td>{{ $item->kode_kegiatan1 }}</td>
                        <td style="width: auto;">{{ $item->keterangan_kegiatan1 }}</td>
                        <td style="text-align: right;">{{ number_format($anggaranKegiatan1,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan1BulanLalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan1BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format((float)$belanjaKegiatan1BulanLalu + (float)$belanjaKegiatan1BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($anggaranKegiatan1 - ((float)$belanjaKegiatan1BulanLalu + (float)$belanjaKegiatan1BulanIni)),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($totalPengembalianKegiatan1,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(((float)$belanjaKegiatan1BulanLalu + (float)$belanjaKegiatan1BulanIni) - $totalPengembalianKegiatan1,2,'.',',') }}</td>
                    </tr>
                @endif
                

                {{-- Kegiatan tingkat 2 --}}
                @if ($item->kode_kegiatan2 && ($item->kode_kegiatan2 !== $kodeKegiatan2))
                    
                    @php
                        $anggaranKegiatan2 = 0;
                        $belanjaKegiatan2BulanLalu = 0;
                        $belanjaKegiatan2BulanIni = 0;
                        $totalPengembalianKegiatan2 = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->kode_kegiatan2 == $anggaranKegiatan->kode_kegiatan2){
                                $anggaranKegiatan2 += (float)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($spjbku as $row) {
                            if($item->kode_kegiatan2 == $row->kode_kegiatan2){
                                $belanjaKegiatan2BulanLalu += (float)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan2BulanIni += (float)$row->total_belanja_bulan_ini;
                                $totalPengembalianKegiatan2 += 0;
                            }
                        }
                    @endphp    

                    <tr style="font-weight: bold;">
                        <td>{{ $item->kode_kegiatan2 }}</td>
                        <td style="width: auto;">{{ $item->keterangan_kegiatan2 }}</td>
                        <td style="text-align: right;">{{ number_format($anggaranKegiatan2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan2BulanLalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan2BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format((float)$belanjaKegiatan2BulanLalu + (int)$belanjaKegiatan2BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($anggaranKegiatan2 - ((float)$belanjaKegiatan2BulanLalu + (int)$belanjaKegiatan2BulanIni)),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($totalPengembalianKegiatan2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(((float)$belanjaKegiatan2BulanLalu + (float)$belanjaKegiatan2BulanIni) - $totalPengembalianKegiatan2,2,'.',',') }}</td>
                    </tr>

                    {{-- belanja pegawai --}}
                    <tr>
                        @php
                            $pegawai2 = 0;
                            $pegawai2_bulanlalu = 0;
                            $pegawai2_bulanini = 0;
                            $pengembalianpegawai2 = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->idmataanggaranpermen == 102){
                                    $pegawai2 += (float)$anggaranKegiatan->total_anggaran; 
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->idmataanggaranpermen == 102){
                                    $pegawai2_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $pegawai2_bulanini += (float)$row->total_belanja_bulan_ini;
                                    $pengembalianpegawai2 += (float)$row->totalpengembalian;
                                }
                            }
                        @endphp
                        <td>{{ $item->kode_kegiatan2 }}</td>
                        <td style="width: auto;">Belanja Pegawai</td>
                        <td style="text-align: right;">{{ number_format($pegawai2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai2_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai2_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai2_bulanlalu + $pegawai2_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai2 - ($pegawai2_bulanlalu + $pegawai2_bulanini),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pengembalianpegawai2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($pegawai2_bulanlalu + $pegawai2_bulanini) - $pengembalianpegawai2,2,'.',',') }}</td>
                    </tr>

                    {{-- belanja barang dan jasa --}}
                    <tr>
                        @php
                            $barangjasa2 = 0;
                            $barangjasa2_bulanlalu = 0;
                            $barangjasa2_bulanini = 0;
                            $pengembalianbarangjasa2 = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->idmataanggaranpermen == 109){
                                    $barangjasa2 += (float)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->idmataanggaranpermen == 109){
                                    $barangjasa2_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $barangjasa2_bulanini += (float)$row->total_belanja_bulan_ini;
                                    $pengembalianbarangjasa2 += (float)$row->totalpengembalian;
                                }
                            }
                        @endphp
                        <td>{{ $item->kode_kegiatan2 }}</td>
                        <td style="width: auto;">Belanja Barang dan Jasa</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2_bulanlalu + $barangjasa2_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa2 - ($barangjasa2_bulanlalu + $barangjasa2_bulanini),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pengembalianbarangjasa2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($barangjasa2_bulanlalu + $barangjasa2_bulanini) - $pengembalianbarangjasa2,2,'.',',') }}</td>
                    </tr>

                    {{-- belanja modal --}}
                    <tr>
                        @php
                            $belanjaModal2 = 0;
                            $belanjaModal2_bulanlalu = 0;
                            $belanjaModal2_bulanini = 0;
                            $pengembalianmodal2 = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->kode_mataanggaran1 == 'III'){
                                    $belanjaModal2 += (int)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->kode_mataanggaran1 == 'III'){
                                    $belanjaModal2_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $belanjaModal2_bulanini += (float)$row->total_belanja_bulan_ini;
                                    $pengembalianmodal2 += (float)$row->totalpengembalian;
                                }
                            }
                        @endphp
                        <td>{{ $item->kode_kegiatan2 }}</td>
                        <td style="width: auto;">Belanja Modal</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2_bulanlalu + $belanjaModal2_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal2 - ($belanjaModal2_bulanlalu + $belanjaModal2_bulanini),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pengembalianmodal2,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($belanjaModal2_bulanlalu + $belanjaModal2_bulanini) - $pengembalianmodal2,2,'.',',') }}</td>
                    </tr>
                @endif
                

                {{-- Kegiatan tingkat 3 --}}
                @if ($item->kode_kegiatan3 && ($item->kode_kegiatan3 !== $kodeKegiatan3))

                    @php
                        $anggaranKegiatan3 = 0;
                        $belanjaKegiatan3BulanLalu = 0;
                        $belanjaKegiatan3BulanIni = 0;
                        $totalPengembalianKegiatan3 = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->kode_kegiatan3 == $anggaranKegiatan->kode_kegiatan3){
                                $anggaranKegiatan3 += (float)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($spjbku as $row) {
                            if($item->kode_kegiatan3 == $row->kode_kegiatan3){
                                $belanjaKegiatan3BulanLalu += (float)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatan3BulanIni += (float)$row->total_belanja_bulan_ini;
                                $totalPengembalianKegiatan3 += (float)$row->totalpengembalian;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $item->kode_kegiatan3 }}</td>
                        <td style="width: auto;">{{ $item->keterangan_kegiatan3 }}</td>
                        <td style="text-align: right;">{{ number_format($anggaranKegiatan3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan3BulanLalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatan3BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format((float)$belanjaKegiatan3BulanLalu + (float)$belanjaKegiatan3BulanIni,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($anggaranKegiatan3 - ((float)$belanjaKegiatan3BulanLalu + (float)$belanjaKegiatan3BulanIni)),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($totalPengembalianKegiatan3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(((float)$belanjaKegiatan3BulanLalu + (float)$belanjaKegiatan3BulanIni) - $totalPengembalianKegiatan3,2,'.',',') }}</td>
                    </tr>

                    {{-- biaya pegawai --}}
                    <tr>
                        @php
                            $pegawai3 = 0;
                            $pegawai3_bulanlalu = 0;
                            $pegawai3_bulanini = 0;
                            $pengembalianpegawai3 = 0;
                            
                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->idmataanggaranpermen == 102){
                                    $pegawai3 += (int)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->idmataanggaranpermen == 102){
                                    $pegawai3_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $pegawai3_bulanini += (float)$row->total_belanja_bulan_ini;
                                    $pengembalianpegawai3 += (float)$row->totalpengembalian;
                                }
                            }
                        @endphp
                        <td>{{ $item->kode_kegiatan3 }}</td>
                        <td style="width: auto;">Belanja Pegawai</td>
                        <td style="text-align: right;">{{ number_format($pegawai3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai3_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai3_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai3_bulanlalu + $pegawai3_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pegawai3 - ($pegawai3_bulanlalu + $pegawai3_bulanini),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pengembalianpegawai3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($pegawai3_bulanlalu + $pegawai3_bulanini) - $pengembalianpegawai3,2,'.',',') }}</td>
                    </tr>
                    
                    {{-- barang dan jasa --}}
                    <tr>
                        @php
                            $barangjasa3 = 0;
                            $barangjasa3_bulanlalu = 0;
                            $barangjasa3_bulanini = 0;
                            $pengembalianbarangjasa3 = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->idmataanggaranpermen == 109){
                                    $barangjasa3 += (int)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->idmataanggaranpermen == 109){
                                    $barangjasa3_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $barangjasa3_bulanini += (float)$row->total_belanja_bulan_ini;
                                    $pengembalianbarangjasa3 += (float)$row->totalpengembalian;
                                }
                            }
                        @endphp
                        <td>{{ $item->kode_kegiatan3 }}</td>
                        <td style="width: auto;">Belanja Barang dan Jasa</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3_bulanlalu + $barangjasa3_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($barangjasa3 - ($barangjasa3_bulanlalu + $barangjasa3_bulanini),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pengembalianbarangjasa3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($barangjasa3_bulanlalu + $barangjasa3_bulanini) - $pengembalianbarangjasa3,2,'.',',') }}</td>
                    </tr>
                    
                    {{-- biaya modal --}}
                    <tr>
                        @php
                            $belanjaModal3 = 0;
                            $belanjaModal3_bulanlalu = 0;
                            $belanjaModal3_bulanini = 0;
                            $pengembalianmodal3 = 0;

                            foreach ($data as $key => $anggaranKegiatan) {
                                if($anggaranKegiatan->kode_mataanggaran1 == 'III'){
                                    $belanjaModal3 += (int)$anggaranKegiatan->total_anggaran;  
                                }
                            }

                            foreach ($spjbku as $row) {
                                if($row->kode_mataanggaran1 == 'III'){
                                    $belanjaModal3_bulanlalu += (float)$row->total_belanja_bulan_lalu;
                                    $belanjaModal3_bulanini += (float)$row->total_belanja_bulan_ini;
                                    $pengembalianmodal3 += (float)$row->totalpengembalian;
                                }
                            }
                        @endphp
                        <td>{{ $item->kode_kegiatan3 }}</td>
                        <td style="width: auto;">Belanja Modal</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3_bulanlalu,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3_bulanini,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3_bulanlalu + $belanjaModal3_bulanini ,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaModal3 - ($belanjaModal3_bulanlalu + $belanjaModal3_bulanini),2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format($pengembalianmodal3,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(($belanjaModal3_bulanlalu + $belanjaModal3_bulanini) - $pengembalianmodal3,2,'.',',') }}</td>
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
                        $totalPengembalianKegiatan4 = 0;

                        foreach ($data as $anggaranKegiatan) {
                            if($item->kode_kegiatan == $anggaranKegiatan->kode_kegiatan){
                                $anggaranKegiatan4 += (float)$anggaranKegiatan->total_anggaran;
                            }
                        }

                        foreach ($spjbku as $row) {
                            if($item->kode_kegiatan == $row->kode_kegiatan){
                                $belanjaKegiatanBulanLalu += (float)$row->total_belanja_bulan_lalu;
                                $belanjaKegiatanBulanIni += (float)$row->total_belanja_bulan_ini;
                                $totalPengembalianKegiatan4 += $row->totalpengembalian;
                            }
                        }
                    @endphp
                    <tr style="font-weight: bold;">
                        <td>{{ $item->kode_kegiatan }}</td>
                        <td style="width: auto;">{{ $item->keterangan_kegiatan }}</td>
                        <td style="text-align: right;">{{ number_format($anggaranKegiatan4,2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatanBulanLalu,2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format($belanjaKegiatanBulanIni,2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format((float)$belanjaKegiatanBulanLalu + (float)$belanjaKegiatanBulanIni,2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format(($anggaranKegiatan4 - ((float)$belanjaKegiatanBulanLalu + (float)$belanjaKegiatanBulanIni)),2,'.','.') }}</td>
                        <td style="text-align: right;">{{ number_format($totalPengembalianKegiatan4,2,'.',',') }}</td>
                        <td style="text-align: right;">{{ number_format(((float)$belanjaKegiatanBulanLalu + (float)$belanjaKegiatanBulanIni) - $totalPengembalianKegiatan4,2,'.',',') }}</td>
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
                                    $totalPengembalian1 = 0;

                                    foreach ($data as $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($ma->kode_mataanggaran1 == $row->kode_mataanggaran1){
                                                $totalRekening1 += (float)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($spjbku as $key => $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($row->kode_mataanggaran1 == $ma->kode_mataanggaran1){
                                                $totalBelanjaBulanLalu1 += (float)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni1 += (float)$row->total_belanja_bulan_ini;
                                                $totalBelanja1 += (float)$row->total_belanja;
                                                $totalPengembalian1 += (float)$row->totalpengembalian;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="width: auto;">{{ $ma->kode_mataanggaran1 }}. {{ $ma->nama_mataanggaran1 }}</td>
                                    <td style="text-align: right;">{{ number_format($totalRekening1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanjaBulanLalu1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanjaBulanIni1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanja1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format(((float)$totalRekening1 - (float)$totalBelanja1),2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalPengembalian1,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanja1 - $totalPengembalian1,2,'.',',') }}</td>
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
                                    $totalPengembalian2 = 0;

                                    foreach ($data as $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($ma->kode_mataanggaran2 == $row->kode_mataanggaran2){
                                                $totalRekening2 += (float)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($spjbku as $key => $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($row->kode_mataanggaran2 == $ma->kode_mataanggaran2){
                                                $totalBelanjaBulanLalu2 += (float)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni2 += (float)$row->total_belanja_bulan_ini;
                                                $totalBelanja2 += (float)$row->total_belanja;
                                                $totalPengembalian2 += (float)$row->totalpengembalian;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="padding-left: 10px; width:auto;">
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
                                    <td style="text-align: right;">{{ number_format(((float)$totalRekening2 - (float)$totalBelanja2),2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalPengembalian2,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanja2 - $totalPengembalian2,2,'.',',') }}</td>
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
                                    $totalPengembalian3 = 0;

                                    foreach ($data as $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($ma->kode_mataanggaran3 == $row->kode_mataanggaran3){
                                                $totalRekening3 += (float)$row->total_anggaran;
                                            }
                                        }
                                    }

                                    foreach ($spjbku as $key => $row) {
                                        if($row->kode_kegiatan == $ma->kode_kegiatan){
                                            if($row->kode_mataanggaran3 == $ma->kode_mataanggaran3){
                                                $totalBelanjaBulanLalu3 += (float)$row->total_belanja_bulan_lalu;
                                                $totalBelanjaBulanIni3 += (float)$row->total_belanja_bulan_ini;
                                                $totalBelanja3 += (float)$row->total_belanja;
                                                $totalPengembalian3 += (float)$row->totalpengembalian;
                                            }
                                        }
                                    }
                                @endphp
                                <tr>
                                    <td></td>
                                    <td style="padding-left: 20px; width:auto;">
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
                                    <td style="text-align: right;">{{ number_format(((float)$totalRekening3 - (float)$totalBelanja3),2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalPengembalian3,2,'.',',') }}</td>
                                    <td style="text-align: right;">{{ number_format($totalBelanja3 - $totalPengembalian3,2,'.',',') }}</td>
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
                                $totalPengembalian = 0;

                                foreach ($spjbku as $key => $row) {
                                    if($row->kode_kegiatan == $ma->kode_kegiatan){
                                        if($row->kode_mataanggaran == $ma->kode_mataanggaran){
                                            $totalBulanLalu = (float)$row->total_belanja_bulan_lalu;
                                            $totalBulanIni = (float)$row->total_belanja_bulan_ini;
                                            $totalBelanja = (float)$row->total_belanja;
                                            $totalPengembalian += (float)$row->totalpengembalian;
                                        }
                                    }
                                }
                            @endphp

                            <tr>
                                <td></td>
                                <td style="padding-left: 30px; width:auto;">
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
                                <td style="text-align: right;">{{ number_format(((float)$ma->total_anggaran - (float)$totalBelanja),2,'.',',') }}</td>
                                <td style="text-align: right;">{{ number_format($totalPengembalian,2,'.',',') }}</td>
                                <td style="text-align: right;">{{ number_format($totalBelanja - $totalPengembalian,2,'.',',') }}</td>
                            </tr>
                        @endif
                    @endforeach

                @endif
            @endforeach
            
            <tr>
                <td colspan="2" style="border:none; border-left: 1px solid black; font-size: 10pt;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td colspan="3" style="border:none; border-right: 1px solid black;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
            </tr>

            {{-- spjbruto --}}
            <tr style="font-weight: bold;">
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
                <td colspan="2" style="padding-left: 1cm; border:none; border-left: 1px solid black; font-size: 10pt;">
                    SPJ BRUTO
                </td>
                <td style="border:none; text-align: right;">{{ number_format($bruto_anggaran,2,'.',',') }}</td>
                <td style="border:none; text-align: right;">{{ number_format($bruto_bulanlalu,2,'.',',') }}</td>
                <td style="border:none; text-align: right;">{{ number_format($bruto_bulanini,2,'.',',') }}</td>
                <td style="border:none; text-align: right;">{{ number_format($bruto_bulanlalu + $bruto_bulanini,2,'.',',') }}</td>
                <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
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
                <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                    Belanja Pegawai
                </td>
                <td style="border: none; text-align: right;">{{ number_format($pegawai_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($pegawai_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($pegawai_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($pegawai_bulanlalu + $pegawai_bulanini,2,'.',',') }}</td>
                <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
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
                <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                    Barang dan Jasa
                </td>
                <td style="border: none; text-align: right;">{{ number_format($barangjasa_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($barangjasa_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($barangjasa_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($barangjasa_bulanlalu + $barangjasa_bulanini,2,'.',',') }}</td>
                <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
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
                <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                    Belanja Modal PM
                </td>
                <td style="border: none; text-align: right;">{{ number_format($modalpm_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalpm_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalpm_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalpm_bulanlalu + $bruto_bulanini,2,'.',',') }}</td>
                <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
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
                <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                    Belanja Modal Gedung Bangunan
                </td>
                <td style="border: none; text-align: right;">{{ number_format($modalgb_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalgb_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalgb_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($modalgb_bulanlalu + $modalgb_bulanini,2,'.',',') }}</td>
                <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
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
                <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                    Belanja Modal ATB
                </td>
                <td style="border: none; text-align: right;">{{ number_format($atb_angg,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($atb_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($atb_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($atb_bulanlalu + $atb_bulanini,2,'.',',') }}</td>
                <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
            </tr>

            {{-- START PENGEMBALIAN --}}
                <tr style="font-weight: bold;">
                    @php
                        $totalpengembalian_bulanlalu = 0;
                        $totalpengembalian_bulanini = 0;

                        foreach ($spjbku as $row) {
                            $totalpengembalian_bulanlalu += (float)$row->pengembalianbelanja_bulan_lalu;
                            $totalpengembalian_bulanini += (float)$row->pengembalianbelanja_bulan_ini;
                            
                        }
                    @endphp
                    <td colspan="2" style="padding-left:1cm; border: none; border-left: 1px solid black; font-size: 10pt;">
                        Pengembalian Belanja
                    </td>
                    <td style="border: none; text-align: right;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpengembalian_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpengembalian_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpengembalian_bulanlalu + $totalpengembalian_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>

                {{-- belanja pegawai --}}
                <tr>
                    @php
                        $pengembalianbelanjapegawai_bulanlalu = 0;
                        $pengembalianbelanjapegawai_bulanini = 0;

                        foreach ($spjbku as $row) {
                            if($row->idmataanggaranpermen == 102){
                                $pengembalianbelanjapegawai_bulanlalu += (float)$row->pengembalianbelanja_bulan_lalu;
                                $pengembalianbelanjapegawai_bulanini += (float)$row->pengembalianbelanja_bulan_ini;
                            }
                        }
                    @endphp
                    <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                        Belanja Pegawai
                    </td>
                    <td style="border: none; text-align: right;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjapegawai_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjapegawai_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjapegawai_bulanlalu + $pengembalianbelanjapegawai_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>

                {{-- belanja barang dan jasa --}}
                <tr>
                    @php
                        $pengembalianbelanjabarangjasa_bulanlalu = 0;
                        $pengembalianbelanjabarangjasa_bulanini = 0;

                        foreach ($spjbku as $row) {
                            if($row->idmataanggaranpermen == 109){
                                $pengembalianbelanjabarangjasa_bulanlalu += (float)$row->pengembalianbelanja_bulan_lalu;
                                $pengembalianbelanjabarangjasa_bulanini += (float)$row->pengembalianbelanja_bulan_ini;
                            }
                        }
                    @endphp

                    <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                        Barang dan Jasa
                    </td>
                    <td style="border: none; text-align: right;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjabarangjasa_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjabarangjasa_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjabarangjasa_bulanlalu + $pengembalianbelanjabarangjasa_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>
                
                {{-- belanja Modal PM --}}
                <tr>
                    @php
                        $pengembalianbelanjamodalpm_bulanlalu = 0;
                        $pengembalianbelanjamodalpm_bulanini = 0;

                        foreach ($spjbku as $row) {
                            if($row->idmataanggaranpermen == 104){
                                $pengembalianbelanjamodalpm_bulanlalu += (float)$row->pengembalianbelanja_bulan_lalu;
                                $pengembalianbelanjamodalpm_bulanini += (float)$row->pengembalianbelanja_bulan_ini;
                            }
                        }
                    @endphp
                    <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                        Belanja Modal PM
                    </td>
                    <td style="border: none; text-align: right;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjamodalpm_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjamodalpm_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjamodalpm_bulanlalu + $pengembalianbelanjamodalpm_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>

                {{-- belanja Modal Gedung dan Bangunan --}}
                <tr>
                    @php
                        $pengembalianbelanjagedungbangunan_bulanlalu = 0;
                        $pengembalianbelanjagedungbangunan_bulanini = 0;

                        foreach ($spjbku as $row) {
                            if($row->idmataanggaranpermen == 105 || $row->idmataanggaranpermen == 127){
                                $pengembalianbelanjagedungbangunan_bulanlalu += (float)$row->pengembalianbelanja_bulan_lalu;
                                $pengembalianbelanjagedungbangunan_bulanini += (float)$row->pengembalianbelanja_bulan_ini;
                            }
                        }
                    @endphp

                    <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">
                        Belanja Modal Gedung Bangunan
                    </td>
                    <td style="border: none; text-align: right;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjagedungbangunan_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjagedungbangunan_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($pengembalianbelanjagedungbangunan_bulanlalu + $pengembalianbelanjagedungbangunan_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>
            {{-- END PENGEMBALIAN --}}


            {{-- START SPJ NETTO --}}
            <tr style="font-weight: bold; ">
                @php
                    $spjnetto_bulanlalu = $bruto_bulanlalu - $totalpengembalian_bulanlalu;
                    $spjnetto_bulanini = $bruto_bulanini - $totalpengembalian_bulanini;

                @endphp
                <td colspan="2" style="padding-left:1cm; border: none; border-left: 1px solid black; font-size: 10pt;">
                    SPJ NETTO
                </td>
                <td style="border: none; text-align: right;"></td>
                <td style="border: none; text-align: right;">{{ number_format($spjnetto_bulanlalu,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($spjnetto_bulanini,2,'.',',') }}</td>
                <td style="border: none; text-align: right;">{{ number_format($spjnetto_bulanlalu + $spjnetto_bulanini,2,'.',',') }}</td>
                <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
            </tr>
            {{-- END SPJ NETTO --}}

            {{-- spasi --}}
            <tr>
                <td colspan="2" style="border:none; border-left: 1px solid black; font-size: 10pt;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td colspan="3" style="border:none; border-right: 1px solid black;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
            </tr>
            {{-- START PENERIMAAN --}}
                <tr>
                    <td colspan="2" style="padding-left:1cm; font-weight:bold; border:none; border-left: 1px solid black;">PENERIMAAN : </td>
                    <td colspan="7" style="border:none; border-right: 1px solid black;"></td>
                </tr>

                {{-- transfer bendahara penerimaan --}}
                @foreach ($spm as $sp)
                    <tr style="font-weight:bold;">
                        <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">  - Transfer Bendahara Penerima</td>  
                        <td style="border: none;"></td>
                        <td style="border: none; text-align: right;">{{ number_format($sp->spm_bulan_lalu,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($sp->spm_bulan_ini,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($sp->spm_bulan_lalu + $sp->spm_bulan_ini,2,'.',',') }}</td>
                        <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                    </tr>
                @endforeach

                {{-- jasa giro --}}
                @foreach ($jasagiro as $jg)
                    <tr style="font-weight:bold;">
                        <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;"> - Jasa Giro</td>
                        <td style="border: none;"></td>
                        <td style="border: none; text-align: right;">{{ number_format($jg->jasagiro_bulan_lalu,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($jg->jasagiro_bulan_ini,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($jg->jasagiro_bulan_lalu + $jg->jasagiro_bulan_ini,2,'.',',') }}</td>
                        <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                    </tr>
                @endforeach

                {{-- pajak --}}
                <tr style="font-weight:bold;">
                    @php
                        $totalpajakpenerimaan_bulanlalu = 0;
                        $totalpajakpenerimaan_bulanini = 0;
                        
                        foreach ($pajak as $pjpen) {
                            $totalpajakpenerimaan_bulanlalu += $pjpen->penerimaan_bulan_lalu;
                            $totalpajakpenerimaan_bulanini += $pjpen->penerimaan_bulan_ini;
                        }
                    @endphp
                    <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;"> - Potongan pajak:</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpenerimaan_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpenerimaan_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpenerimaan_bulanlalu + $totalpajakpenerimaan_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>
                @foreach ($pajak as $pjpen)
                    <tr>
                        <td colspan="2" style="padding-left:2cm; border: none; border-left: 1px solid black;"> - {{ $pjpen->namaexternal }}:</td>
                        <td style="border: none;"></td>
                        <td style="border: none; text-align: right;">{{ number_format($pjpen->penerimaan_bulan_lalu,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($pjpen->penerimaan_bulan_ini,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($pjpen->penerimaan_bulan_lalu + $pjpen->penerimaan_bulan_ini,2,'.',',') }}</td>
                        <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                    </tr>
                @endforeach

                {{-- total penerimaan --}}
                <tr style="font-weight:bold;">
                    @php
                        $totalpenerimaan_bulanlalu = $spm[0]->spm_bulan_lalu + $jasagiro[0]->jasagiro_bulan_lalu + $totalpajakpenerimaan_bulanlalu;
                        $totalpenerimaan_bulanini = $spm[0]->spm_bulan_ini + $jasagiro[0]->jasagiro_bulan_ini + $totalpajakpenerimaan_bulanini;
                    @endphp
                    <td colspan="2" style="padding-left:1cm; border: none; border-left: 1px solid black;">JUMLAH PENERIMAAN</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($totalpenerimaan_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($totalpenerimaan_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($totalpenerimaan_bulanlalu + $totalpenerimaan_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>
            {{-- END PENERIMAAN --}}
            
            {{-- spasi --}}
            <tr>
                <td colspan="2" style="border:none; border-left: 1px solid black; font-size: 10pt;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td colspan="3" style="border:none; border-right: 1px solid black;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
            </tr>
            {{-- START PENGELUARAN --}}
                <tr>
                    <td colspan="2" style="padding-left:1cm; font-weight:bold; border:none; border-left: 1px solid black;">PENGELUARAN : </td>
                    <td colspan="7" style="border:none; border-right: 1px solid black;"></td>
                </tr>

                {{-- spj --}}
                <tr style="font-weight:bold;">
                    @php
                        $spj_pengeluaran_bulan_lalu = 0;
                        $spj_pengeluaran_bulan_ini = 0;

                        foreach ($spjbku as $key => $item) {
                            $spj_pengeluaran_bulan_lalu += (float)$item->total_belanja_bulan_lalu;
                            $spj_pengeluaran_bulan_ini += (float)$item->total_belanja_bulan_ini;
                        }
                        
                    @endphp
                    <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;">  - SPJ</td>  
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($spj_pengeluaran_bulan_lalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($spj_pengeluaran_bulan_ini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($spj_pengeluaran_bulan_lalu + $spj_pengeluaran_bulan_ini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>

                {{-- jasa giro --}}
                @foreach ($jasagiro as $jg)
                    <tr style="font-weight:bold;">
                        <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;"> - Jasa Giro</td>
                        <td style="border: none;"></td>
                        <td style="border: none; text-align: right;">{{ number_format($jg->jasagiro_bulan_lalu,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($jg->jasagiro_bulan_ini,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($jg->jasagiro_bulan_lalu + $jg->jasagiro_bulan_ini,2,'.',',') }}</td>
                        <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                    </tr>
                @endforeach

                {{-- pajak --}}
                <tr style="font-weight:bold;">
                    @php
                        $totalpajakpengeluaran_bulanlalu = 0;
                        $totalpajakpengeluaran_bulanini = 0;
                        
                        foreach ($pajak as $pjpeng) {
                            $totalpajakpengeluaran_bulanlalu += $pjpeng->pengeluaran_bulan_lalu;
                            $totalpajakpengeluaran_bulanini += $pjpeng->pengeluaran_bulan_ini;
                        }
                    @endphp

                    <td colspan="2" style="padding-left:1.5cm; border: none; border-left: 1px solid black;"> - Penyetoran pajak:</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpengeluaran_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpengeluaran_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right;">{{ number_format($totalpajakpengeluaran_bulanlalu + $totalpajakpengeluaran_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>
                @foreach ($pajak as $pjpeng)
                    <tr>
                        <td colspan="2" style="padding-left:2cm; border: none; border-left: 1px solid black;"> - {{ $pjpeng->namaexternal }}:</td>
                        <td style="border: none;"></td>
                        <td style="border: none; text-align: right;">{{ number_format($pjpeng->pengeluaran_bulan_lalu,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($pjpeng->pengeluaran_bulan_ini,2,'.',',') }}</td>
                        <td style="border: none; text-align: right;">{{ number_format($pjpeng->pengeluaran_bulan_lalu + $pjpeng->pengeluaran_bulan_ini,2,'.',',') }}</td>
                        <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                    </tr>
                @endforeach

                {{-- total pengeluaran --}}
                <tr style="font-weight:bold;">
                    @php
                        $totalpengeluaran_bulanlalu = ($spj_pengeluaran_bulan_lalu + $jasagiro[0]->jasagiro_bulan_lalu + $totalpajakpengeluaran_bulanlalu);
                        $totalpengeluaran_bulanini = ($spj_pengeluaran_bulan_ini + $jasagiro[0]->jasagiro_bulan_ini + $totalpajakpengeluaran_bulanini);
                    @endphp
                    <td colspan="2" style="padding-left:1cm; border: none; border-left: 1px solid black;">JUMLAH PENGELUARAN</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($totalpengeluaran_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($totalpengeluaran_bulanlalu + $totalpengeluaran_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($totalpengeluaran_bulanlalu + $totalpengeluaran_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>

                {{-- saldo kas --}}
                <tr style="font-weight:bold;">
                    @php
                        $saldokas_bulanlalu = ($totalpenerimaan_bulanlalu - $totalpengeluaran_bulanlalu);
                        $saldokas_bulanini = ($totalpenerimaan_bulanini - $totalpengeluaran_bulanini);
                    @endphp
                    <td colspan="2" style="padding-left:1cm; border: none; border-left: 1px solid black;">SALDO KAS</td>
                    <td style="border: none;"></td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($saldokas_bulanlalu,2,'.',',') }}</td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($saldokas_bulanini + $totalpengeluaran_bulanini,2,'.',',') }}</td>
                    <td style="border: none; text-align: right; padding-left: 2em;">{{ number_format($saldokas_bulanlalu + $saldokas_bulanini,2,'.',',') }}</td>
                    <td colspan="3" style="border:none; border-right: 1px solid black;"></td>
                </tr>
            {{-- END PENGELUARAN --}}
            

            {{-- spasi --}}
            <tr>
                <td colspan="2" style="border:none; border-left: 1px solid black; font-size: 10pt;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td colspan="3" style="border:none; border-right: 1px solid black;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-weight:bold; font-size: 10pt; border: none; border-left: 1px solid black;">Saldo Kas BLUD</td>
                <td colspan="2" style="font-weight:bold; font-size: 10pt; border: none; text-align:center;">Mengetahui</td>
                <td colspan="2" style="border: none;"></td>
                <td colspan="2" style="font-weight:bold; font-size: 10pt; border:none; border-right: 1px solid black; text-align:center;">Yogyakarta, 30 September 2024</td>
            </tr>
            <tr>
                <td colspan="3" style="font-weight:bold; border: none; border-left: 1px solid black;">Terdiri dari : </td>
                <td colspan="2" style="font-weight:bold; font-size: 10pt; border: none; text-align:center;">Pimpinan BLUD</td>
                <td colspan="2" style="border: none;"></td>
                <td colspan="2" style="font-weight:bold; font-size: 10pt; border:none; border-right: 1px solid black; text-align:center;">Bendahara Pengeluaran BLUD</td>
            </tr>
            <tr>
                <td colspan="2" style="border: none; border-left: 1px solid black;">
                    <div style="display: flex; flex-direction:row">
                        <div style="width: 30%; font-weight:bold; ">
                            Tunai
                        </div>
                        <div>
                            : 
                        </div>
                    </div>
                </td>
                <td colspan="2" style="border: none; text-align:center;"></td>
                <td colspan="2" style="border: none;"></td>
                <td colspan="3" style="border:none; border-right: 1px solid black; text-align:center;"></td>
            </tr>
            <tr>
                <td colspan="2" style="border: none; border-left: 1px solid black;">
                    <div style="display: flex; flex-direction:row">
                        <div style="width: 30%; font-weight:bold; ">
                            Sisa Bank
                        </div>
                        <div>
                            : {{ number_format(($saldokas_bulanlalu + $saldokas_bulanini) - $uangmukakerja[0]->uangmukakerja,2,'.',',') }}</td>
                        </div>
                    </div>
                <td colspan="2" style="border: none; text-align:center;"></td>
                <td colspan="2" style="border: none;"></td>
                <td colspan="3" style="border:none; border-right: 1px solid black; text-align:center;"></td>
            </tr>
            <tr>
                <td colspan="2" style="border: none; border-left: 1px solid black;">
                    <div style="display: flex; flex-direction:row">
                        <div style="width: 30%; font-weight:bold; ">
                            Surat Berharga
                        </div>
                        <div>
                            : 
                        </div>
                    </div>
                </td>
                <td colspan="2" style="border: none; text-align:center;"></td>
                <td colspan="2" style="border: none;"></td>
                <td colspan="3" style="border:none; border-right: 1px solid black; text-align:center;"></td>
            </tr>
            <tr>
                <td colspan="2" style="border: none; border-left: 1px solid black;">
                    <div style="display: flex; flex-direction:row">
                        <div style="width: 30%; font-weight:bold; ">
                            Uang Muka Kerja
                        </div>
                        <div>
                            : {{ number_format($uangmukakerja[0]->uangmukakerja,2,'.',',') }}
                        </div>
                    </div>
                </td>
                <td colspan="2" style="border: none; text-align:center;"></td>
                <td colspan="2" style="border: none;"></td>
                <td colspan="3" style="border:none; border-right: 1px solid black; text-align:center;"></td>
            </tr>
            <tr>
                <td colspan="2" style="border: none; border-left: 1px solid black;">
                    <div style="display: flex; flex-direction:row">
                        <div style="width: 30%; font-weight:bold; ">
                            Jumlah
                        </div>
                        <div>
                            : {{ number_format(( ($saldokas_bulanlalu + $saldokas_bulanini) - $uangmukakerja[0]->uangmukakerja )+$uangmukakerja[0]->uangmukakerja,2,'.',',') }}
                        </div>
                    </div>
                </td>
                <td colspan="2" style="border: none; text-align:center;"></td>
                <td colspan="2" style="border: none;"></td>
                <td colspan="3" style="border:none; border-right: 1px solid black; text-align:center;"></td>
            </tr>

            {{-- spasi --}}
            <tr>
                <td colspan="2" style="border:none; border-left: 1px solid black; font-size: 10pt;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td colspan="3" style="border:none; border-right: 1px solid black;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
            </tr>
            {{-- spasi --}}
            <tr>
                <td colspan="2" style="border:none; border-left: 1px solid black; font-size: 10pt;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td style="border:none;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
                <td colspan="3" style="border:none; border-right: 1px solid black;">
                    <p style="opacity: 0;">Spasi</p>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="border: none; border-left: 1px solid black;"></td>
                <td colspan="2" style="font-weight:bold; font-size: 10pt; border: none; text-align:center;">dr. Akhmad Akhadi S, M.P.H</td>
                <td colspan="2" style="border: none;"></td>
                <td colspan="2" style="font-weight:bold; font-size: 10pt; border:none; border-right: 1px solid black; text-align:center;">Christina Dewi Isti Paramita, S.E</td>
            </tr>
            <tr>
                <td colspan="3" style="border: none; border-left: 1px solid black; border-bottom: 1px solid black;"></td>
                <td colspan="2" style="font-weight:bold; font-size: 10pt; border: none; text-align:center; border-bottom: 1px solid black;">NIP. 19680714 200012 1 002</td>
                <td colspan="2" style="border: none; border-bottom: 1px solid black;"></td>
                <td colspan="2" style="font-weight:bold; font-size: 10pt; border:none; border-right: 1px solid black; text-align:center; border-bottom: 1px solid black;">NIP. 19841027 201502 2 001</td>
            </tr>
        </tbody>
    </table>
</body>
</html>