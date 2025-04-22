<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>SPP</title>
    
    <style>
        /* @font-face {
            font-family: 'BookmanOldStyle';
            src: url('{{ asset('fonts/BookmanOldStyle.TTF') }}')
        } */

        @page {
            size: 21.5 33cm;
        }
        @media print {
            .page, .page-break { break-after: page; }
        }
        body {
            font-family: 'Arial';
            font-size: 10pt;
            line-height: 1;
            margin: 0;
        }
        .table-target {
            border-collapse: collapse;
            margin-top: 1em;
        }
        .table-target thead tr th {
            border: 1px solid black;
            padding: .3em .6em;
        }
        .table-target tbody tr td {
            border: 1px solid black;
            padding: .3em .6em;
        }
    </style>
</head>

<body>
    <div class="page">
        {{-- header --}}
        <table style="font-weight:bold; line-height: 1.5;" cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td style="text-align: center;">
                    PROVINSI DI YOGYAKARTA
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    SURAT PERMINTAAN PEMBAYARAN (SPP)
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    Nomor {{ isset($data) ? $data[0]->nomorspp  : '' }}
                </td>
            </tr>
        </table>
    
        <table class="table-target" cellspacing="0" cellpadding="0" width="100%">
            <tbody>
                <tr>
                    <td colspan="4" style="font-weight:bold; text-decoration:underline; text-align: center;">Langsung Barang dan Jasa</td>
                </tr>
                <tr>
                    <td colspan="4" style="font-weight:bold; text-align: center;">SPP - LS</td>
                </tr>
                <tr>
                    <td style="width: 5%;">1.</td>
                    <td style="width:20%;">Nama SKD</td>
                    <td colspan="2">Dinas Kesehatan</td>
                </tr>
                <tr>
                    <td>2.</td>
                    <td style="width:20%;">Nama Unit SKPD</td>
                    <td colspan="2">Rumah Sakit Jiwa Grhasia</td>
                </tr>
                <tr>
                    <td>3.</td>
                    <td style="width:20%;">Kode dan Nama Sub Kegiatan</td>
                    <td colspan="2">{{ isset($data) ? $data[0]->kodesubsub.' - '.$data[0]->keterangansubsub  : '' }}</td>
                </tr>
                <tr>
                    <td>4.</td>
                    <td style="width:20%;">Nama Kuasa Pengguna Anggaran</td>
                    <td colspan="2">{{ isset($setting) ? $setting[0]->namalengkap : '' }}</td>
                </tr> 
                <tr>
                    <td>5.</td>
                    <td style="width:20%;">Nama PPTK</td>
                    <td colspan="2">{{ isset($data) ? $data[0]->namalengkap : '' }}</td>
                </tr>
                <tr>
                    <td>6.</td>
                    <td style="width:20%;">Nama Bendahara Pengeluaran Pembantu</td>
                    <td colspan="2">{{ isset($setting) ? $setting[0]->namabendahara : '' }}</td>
                </tr>
                <tr>
                    <td>7.</td>
                    <td style="width:20%;">NPWP Bendahara Pengeluaran Pembantu</td>
                    <td colspan="2">{{ isset($setting) ? $setting[0]->nomornpwp : '' }}</td>
                </tr>
                <tr>
                    <td>8.</td>
                    <td style="width:20%;">Nama Bank</td>
                    <td colspan="2">{{ isset($setting) ? $setting[0]->namabank : '' }}</td>
                </tr>
                <tr>
                    <td>9.</td>
                    <td style="width:20%;">Nomor Rekening Bank</td>
                    <td colspan="2">{{ isset($setting) ? $setting[0]->norekening : '' }}</td>
                </tr>
                <tr>
                    <td>10.</td>
                    <td style="width:20%;">Nama di Rekening Bank</td>
                    <td colspan="2">{{ isset($setting) ? $setting[0]->namadirekeningbank : '' }}</td>
                </tr>
                <tr>
                    <td>11.</td>
                    <td style="width:20%;">Untuk Keperluan</td>
                    <td colspan="2">Pembayaran {{ isset($data) ? $data[0]->namamataanggaran.' ('.$data[0]->kodemataanggaran.') Pada Sub '.$data[0]->keterangansub.' Sub sub '.$data[0]->keterangansubsub.' Tanggal '.$tglindo : '' }}</td>
                </tr>
                <tr>
                    <td>12.</td>
                    <td style="width:20%;">Dasar Pengeluaran</td>
                    <td colspan="2">
                        <table style="width:100%;">
                            <tr>
                                <td style="font-weight:bold; border:none; padding:0; width:20%;">{{ isset($setting) ? $setting[0]->dasarpengeluaran : '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:0; width:20%;">Nomor</td>
                                <td style="font-weight:bold; border:none; padding:0;">{{ isset($setting) ? $setting[0]->nomordasarpengeluaran : '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:0; width:20%;">Tanggal</td>
                                <td style="font-weight:bold; border:none; padding:0;">{{ $tgldasarpengeluaran }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <table style="width: 100%;">
                            <tr>
                                <td style="border:none; padding:0; width:20%;">Sebesar</td>
                                <td style="font-weight:bold; border:none; padding:0;">Rp. {{ isset($anggaran) ? number_format($anggaran[0]->totalanggaran,2,',','.') : '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:0; width:20%;">Terbilang</td>
                                <td style="border:none; padding:0;">({{ $terbilang }} rupiah)</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="4"></td>
                </tr>
                <tr>
                    <td>No</td>
                    <td colspan="3" style="text-align:center;">Uraian</td>
                </tr>
                <tr>
                    <td>I.</td>
                    <td colspan="3">{{ isset($setting) ? $setting[0]->dasarpengeluaran : '' }}</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Tanggal: {{ $tgldasarpengeluaran }}</td>
                    <td>Nomor: {{ isset($setting) ? $setting[0]->nomordasarpengeluaran : '' }}</td>
                    <td>Rp. {{ isset($anggaran) ? number_format($anggaran[0]->totalanggaran,2,',','.') : '' }}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align:center;">Pada SPP ini ditetapkan lampiran-lampiran yang diperlukan sebagaimana tertera pada daftar kelengkapan dokumen SPP ini.</td>
                </tr>
            </tr>                    
            </tbody>
        </table>
    
        {{-- tanda tangan --}}
        <table style="border:1px solid black; width:100%;">
            <tbody>
                <tr>
                    <td colspan="2" style="padding-top: 20px;"></td>
                    <td style="padding-top: 20px; text-align:center;">Yogyakarta, {{ $tglindo }}</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align:center; font-weight:bold;">PEJABAT PELAKSANA TEKNIS KEGIATAN</td>
                    <td style="text-align:center; font-weight:bold;">BENDAHARA PENGELUARAN PEMBANTU</td>
                </tr>
                <tr style="font-weight:bold; text-decoration:underline;">
                    <td colspan="2" style="padding-top: 100px; text-align:center;">{{ isset($data) ? $data[0]->namalengkap : '' }}</td>
                    <td style="padding-top: 100px; text-align:center;">{{ isset($setting) ? $setting[0]->namabendahara : '' }}</td>
                </tr>
                <tr style="font-weight:bold;">
                    <td colspan="2" style="text-align:center;">{{ isset($data) ? $data[0]->nippptk : '' }}</td>
                    <td style="text-align:center;">{{ isset($setting) ? $setting[0]->nipbendahara : '' }}</td>
                </tr>
                <tr>
                    <td style="padding-top: 50px;">Lembar Asli</td>
                    <td style="padding-top: 50px; font-weight:bold;">Untuk Pengguna Anggaran/PPK-SKPD</td>
                </tr>
                <tr>
                    <td>Salinan 1</td>
                    <td style="font-weight:bold;">Untuk Kuasa BUD</td>
                </tr>
                <tr>
                    <td>Salinan 2</td>
                    <td style="font-weight:bold;">Untuk Bendahara Pengeluaran</td>
                </tr>
                <tr>
                    <td>Salinan 3</td>
                    <td style="font-weight:bold;">Untuk Arsip Bendahara Pengeluaran</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="page">
        {{-- header --}}
        <table style="font-weight:bold; line-height:1.5;" cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td style="text-align: center;">
                    PROVINSI DI YOGYAKARTA
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    SURAT PERMINTAAN PEMBAYARAN (SPP)
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    NOMOR {{ isset($data) ? $data[0]->nomorspp  : '' }}
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    TAHUN ANGGARAN {{ isset($setting) ? $setting[0]->tahunanggaran : ''}}
                </td>
            </tr>
        </table>

        {{-- content --}}
        <p style="text-align:center; font-weight:bold;">RINCIAN RENCANA PENGGUNAAN</p>
        <table class="table-target" cellspacing="0" cellpadding="0" width="100%">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode Rekening</th>
                    <th>Uraian</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr style="font-weight:bold;">
                    <td>1.</td>
                    <td colspan="3">Nomor {{ isset($setting) ? $setting[0]->dasarpengeluaran : '' }} : {{ isset($setting) ? $setting[0]->nomordasarpengeluaran : '' }}</td>
                </tr> 
                <tr style="font-weight:bold;">
                    <td>2.</td>
                    <td colspan="3">{{ isset($data) ? $data[0]->kodesub : '' }} {{ isset($data) ? $data[0]->keterangansub : ''}}</td>
                </tr>
                <tr style="font-weight:bold;">
                    <td>3.</td>
                    <td colspan="3">{{ isset($data) ? $data[0]->kodesubsub : '' }} {{ isset($data) ? $data[0]->keterangansubsub : ''}}</td>
                </tr>
                <tr>
                    <td>4.</td>
                    <td>{{ isset($data) ? $data[0]->kodemataanggaran : '' }}</td>
                    <td>{{ isset($data) ? $data[0]->namamataanggaran : '' }}</td>
                    <td>Rp. {{ isset($data) ? number_format($data[0]->totalspj,2,',','.') : '' }}</td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align:right;">Jumlah : </td>
                    <td>Rp. {{ isset($data) ? number_format($data[0]->totalspj,2,',','.') : '' }}</td>
                </tr>                
            </tbody>
        </table>
        <p>Terbilang: {{ $terbilangSPJ }} rupiah</p>

        {{-- tanda tangan --}}
        <table style="width:100%;">
            <tbody>
                <tr>
                    <td style="padding-top: 20px; text-align:center;">Mengetahui/Menyetujui,</td>
                    <td style="padding-top: 20px; text-align:center;">Yogyakarta, {{ $tglindo }}</td>
                </tr>
                <tr>
                    <td style="text-align:center; font-weight:bold;">KUASA PENGGUNA ANGGARAN</td>
                    <td style="text-align:center; font-weight:bold;">BENDAHARA PENGELUARAN PEMBANTU</td>
                </tr>
                <tr style="font-weight:bold; text-decoration:underline;">
                    <td style="padding-top: 100px; text-align:center;">{{ isset($setting) ? $setting[0]->namalengkap : '' }}</td>
                    <td style="padding-top: 100px; text-align:center;">{{ isset($setting) ? $setting[0]->namabendahara : '' }}</td>
                </tr>
                <tr style="font-weight:bold;">
                    <td style="text-align:center;">{{ isset($data) ? $setting[0]->nipkuasa : '' }}</td>
                    <td style="text-align:center;">{{ isset($setting) ? $setting[0]->nipbendahara : '' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
        window.print()
    </script>
</body>

</html>
