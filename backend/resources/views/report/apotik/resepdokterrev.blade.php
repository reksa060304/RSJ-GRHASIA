<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="style.css">
        <title>E-Resep</title>
        <style>
            .fs-11{
                font-size: 11px;
                font-family: 'Tahoma';
            }

            .fs-13{
                font-size: 13px;
                font-family: 'Tahoma';
            }

            .fs-9{
                font-size: 11px;
                font-family: 'Tahoma';
            }

            
            th,
            table {
                border-top: 1px solid black;
                border-collapse: collapse;
            }

            td.description,
            th.description {
                width: 165px;
                max-width: 165px;
            }

            td.quantity,
            th.quantity {
                width: 95px;
                max-width: 95px;
                word-break: break-all;
            }

            td.price,
            th.price {
                width: 100px;
                max-width: 100px;
            }

            .centered {
                text-align: center;
                align-content: center;
            }

            .ticket {
                width: 380px;
                max-width: 380px;
            }

            @media print {
                .hidden-print,
                .hidden-print * {
                    display: none !important;
                }
                .print-copy {
                    display: block;
                    page-break-after: always;
                    break-after: page;
                }
                .print-copy:last-child {
                    page-break-after: auto;
                    break-after: auto;
                }
            }

            @page {
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div class="ticket">
            @if($cetakkin == 1)
            <p class="centered fs-11" style="margin-top: 30px;"><b>RESEP</b>
                <b><br>Rumah Sakit Jiwa Grhasia</b>
                <br>Jl. Kaliurang KM.17, Pakembinangun, Kec. Pakem, Kab. Sleman, DIY
            </p>

            <table  style="border-top: none; margin-top: -10px;">
                <tbody>
                    <tr>
                        <td class="price fs-9"><strong></strong></td>
                        <td class="description fs-9" style="text-align: left"></td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-9"><strong></strong></td>
                        <td class="description fs-9" style="text-align: right"><b>CM.FM.02</b></td>
                    </tr>
                    <tr>
                        <td colspan="2" class="fs-13"><strong></strong></td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-9"><strong></strong></td>
                        <td class=" fs-9" style="text-align: right" width="200"><b><u>RESEP {{ $raw->kelompokpasien }}</u></b></td>
                    </tr>
                </tbody>
            </table>

            <p class="centered fs-13" style="margin-top: 0px;">No. Resep: {{$skrining->noresep}}</p>
            <table>
                <thead>
                    <tr>
                        <th class="quantity fs-13">R/</th>
                        <th class="description fs-13">Nama Obat</th>
                        <th class="description fs-13">Dosis</th>
                        <th class="price fs-13">Jumlah</th>
                        <th class="description fs-13">Signa</th>

                        {{-- <th class="price fs-13">Keterangan</th> --}}
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($details as $d){ ?>
                        <tr>
                            <td class="price fs-13" style="text-align: center"><?= $d->rke; ?></td>
                            <td class="price fs-13" style="text-align: left"><?= $d->namaproduk; ?></td>
                            <td class="fs-13" style="text-align: center">{{ $d->dosis }}</td>
                            <td class="price fs-13" style="text-align: center"><?= $d->jumlah; ?></td>
                            <td class="price fs-13" style="text-align: center"><?= $d->catatandokter ?></td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                            <td colspan="3" class="price fs-13" style="text-align: center"> <?= $d->keteranganpakai != '-' && $d->keteranganpakai != '' && $d->keteranganpakai != ' ' ? ' / '. $d->keteranganpakai : null ?></td>
                        </tr>
                    <?php } ?>
                    <tr style="height: 10px;"><td></td></tr>
                </tbody>
            </table>
            <table style="margin-left: 20px;">
                <tbody>
                    <tr>
                        <td class="price fs-9"><strong>Status Pembiayaan</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->kelompokpasien }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-9"><strong>Sumber Resep</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->ruangantujuan }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-9"><strong>No. Rekam Medik</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->nocm }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-9"><strong>Tanggal Resep</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->tglorder }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-9"><strong>Nama Pasien</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->namapasien }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-9"><strong>Nama Dokter</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->namalengkap }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-9"><strong>Tgl Lahir</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->tgllahir }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-9"><strong>Jenis Kelamin</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->jeniskelamin }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-9"><strong>Alergi</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->alergi }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-9"><strong>Ruangan Asal</strong></td>
                        <td class="description fs-9" style="text-align: left">: {{ $raw->ruanganasal }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-9"><strong>No. SEP</strong></td>
                        <td class="description fs-9" style="text-align: left">: 
                            @if (isset($raw->nosep))
                                {{ $raw->nosep }}
                            @endif
                        </td>
                        <td style="width: 10px;"><strong></strong></td>
                    </tr>
                    <tr>
                        <td class="price fs-9"><strong>No. Antrian</strong></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: left; vertical-align: middle; height: 50px;">
                            <strong style="font-size: 36px;">{{ $raw->noantri }}</strong>
                        </td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td colspan="2" class="price fs-9" style="text-align: center; vertical-align: middle;">Tanda Tangan Penerima</td>
                    </tr>
                    <tr style="height: 30px;"><td></td></tr>
                    <tr>
                        <td class="price fs-9"><strong></strong></td>
                        <td class="description fs-9" style="text-align: left"></td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-9"><strong></strong></td>
                        <td class="price fs-9" style="text-align: center">(...............)</td>
                    </tr>
                </tbody>
            </table>
            <p class="centered fs-11" style="margin-top: -10px;">------Petugas Farmasi-----</p>
            <table style="margin-left: 20px;">
                <thead>
                    <tr>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                            Penerima
                            <br><br><br><br><br>
                            ............
                        </td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                            Penelaah Resep
                            <br><br><br><br><br>
                            ............
                        </td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                            Peracik dan Penelaah Obat
                            <br><br><br><br>
                            ............
                        </td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                            Penyerahan dan Informasi
                            <br><br><br><br>
                            ............
                        </td>
                    </tr>
                    
                </thead>
            </table>
            @endif
        </div>
        <div class="ticket">
            @if($cetakkin == 2)
            
            <p class="fs-9" style="text-align: left; margin-top: 30px; margin-left: 20px">I. TELAAH RESEP</p>
            <table style="margin-left: 20px;">
                <thead>
                    <tr>
                        <th class="quantity fs-9" style="border: 1px solid black;">No.</th>
                        <th class="description fs-9" style="border: 1px solid black;">Uraian</th>
                        <th class="price fs-9" style="border: 1px solid black;">Ya</th>
                        <th class="price fs-9" style="border: 1px solid black;">Tidak</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">1.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Administrasi</td>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Nama, tanggal lahir, jenis kelamin, dan identitas pasien</td>
                        @if($skrining->rpenulis == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rpenulis == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Identitas dokter penulis resep dan paraf/keabsahan dokter</td>
                        @if($skrining->ridentitasdokter == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->ridentitasdokter == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tanggal resep</td>
                        @if($skrining->rtanggalresep == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rtanggalresep == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Cara Bayar Pasien</td>
                        @if($skrining->rcarabayar == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rcarabayar == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Ruang / unit asal resep</td>
                        @if($skrining->rruanganresep == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rruanganresep == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">2.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Farmasetis</td>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Nama obat, bentuk sediaan</td>
                        @if($skrining->rnamaobat == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rnamaobat == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Dosis dan jumlah obat</td>
                        @if($skrining->robat == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->robat == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Stabilitas dan inkompatibilitas sediaan</td>
                        @if($skrining->rstabilitas == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rstabilitas == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Aturan dan cara penggunaan</td>
                        @if($skrining->raturan == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->raturan == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">3.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Klinis</td>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Ketepatan indikasi, dosis, dan waktu penggunaan obat </td>
                        @if($skrining->rmr == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rmr == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Duplikasi pengobatan</td>
                        @if($skrining->rberatbedan == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rberatbedan == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Potensi Alergi/Hipertensitivitas dan Reaksi Obat yang Tidak Dikehendaki</td>
                        @if($skrining->ralergi == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->ralergi == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Interaksi antara obat dan obat lain atau dengan makanan</td>
                        @if($skrining->rinteraksi == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rinteraksi == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Variasi Kriteria penggunaan dari rumah sakit(PPK dan Formularium)</td>
                        @if($skrining->rvariasi == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rvariasi == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Berat badan, tinggi badan pasien dan atau informasi fisiologis lainnya (jika diperlukan)</td>
                        @if($skrining->rbeban == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rbeban == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Kontra Indikasi</td>
                        @if($skrining->rdokter == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rdokter == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                </tbody>
            </table>
            <p class="fs-9" style="text-align: left; margin-left: 20px">II. TELAAH OBAT</p>
            <table style="margin-left: 20px;">
                <thead>
                    <tr>
                        <th class="quantity fs-9" style="border: 1px solid black;">No.</th>
                        <th class="description fs-9" style="border: 1px solid black;">Uraian</th>
                        <th class="price fs-9" style="border: 1px solid black;">Ya</th>
                        <th class="price fs-9" style="border: 1px solid black;">Tidak</th>
                    </tr>
                </thead>
                @if($skrining != null)
                <tbody>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">1.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat pasien</td>
                        @if($skrining->rpasien == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rpasien == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">2.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat nama obat</td>
                        @if($skrining->rruang == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rruang == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">3.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat dosis dan jumlah obat</td>
                        @if($skrining->rstatusjamin == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rstatusjamin == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">4.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat rute pemberian</td>
                        @if($skrining->rjumlahobat == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rjumlahobat == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">5.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat waktu pemberian</td>
                        @if($skrining->rdatawaktu == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rdatawaktu == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                </tbody>
            </table>
            @if($skrining->ketskrining != null)
            <p class="fs-9" style="text-align: left; margin-left: 20px">Ket: {{$skrining->ketskrining}}</p><br>
            @else
            <p class="fs-9" style="text-align: left; margin-left: 20px">Ket: </p><br>
            @endif
            @elseif($skrining == null)
            <table style="margin-left: 20px">
                <tbody>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">1.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Obat Sesuai</td>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">2.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Dosis</td>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">3.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Jumlah</td>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">4.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Frekuensi</td>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">5.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Rute</td>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                    </tr>
                </tbody>
            </table>
            <p class="fs-9" style="text-align: left; margin-left: 20px">Ket: </p>
            @endif
            @endif
        </div>
        <div class="ticket">
            @if($cetakkin == 3)
            <p class="fs-9" style="text-align: center; margin-top: 20px;"><strong>Verifikasi Kesesuaian Obat</strong></p>
            @php $ks = $ks_obat ?: (object)[]; @endphp
            <table style="margin-left: 20px; width: 340px; border: 1px solid black;">
                <thead>
                    <tr>
                        <th class="description fs-9" style="border: 1px solid black;">Telaah Obat</th>
                        <th class="price fs-9" style="border: 1px solid black; width: 35px;">Ya</th>
                        <th class="price fs-9" style="border: 1px solid black; width: 35px;">Tidak</th>
                        <th class="description fs-9" style="border: 1px solid black; width: 120px;">Keterangan/Tindak Lanjut</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Identitas pasien</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanidentitas == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanidentitas == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketidentitas ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Nama Obat dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapannamaobat == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapannamaobat == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketnamaobat ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Jumlah/Dosis dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanjumlahdosis == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanjumlahdosis == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketjumlahdosis ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Rute dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanrute == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanrute == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketrute ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Waktu dan frekuensi Pemberian dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanwaktufrekuensi == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanwaktufrekuensi == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketwaktufrekuensi ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" colspan="3" style="border: 1px solid black;">Penelaah</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">({{ $ks->penelaahpenyiapan ?? '...............' }})</td>
                    </tr>
                </tbody>
            </table>

            <table style="margin-left: 20px; width: 340px; border: 1px solid black; margin-top: 5px;">
                <thead>
                    <tr>
                        <th class="description fs-9" style="border: 1px solid black;">Telaah Obat</th>
                        <th class="price fs-9" style="border: 1px solid black; width: 35px;">Ya</th>
                        <th class="price fs-9" style="border: 1px solid black; width: 35px;">Tidak</th>
                        <th class="description fs-9" style="border: 1px solid black; width: 120px;">Keterangan/Tindak Lanjut</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Identitas pasien</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanidentitas == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanidentitas == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketidentitas ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Nama Obat dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikannamaobat == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikannamaobat == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketnamaobat ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Jumlah/Dosis dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanjumlahdosis == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanjumlahdosis == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketjumlahdosis ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Rute dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanrute == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanrute == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketrute ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Waktu dan frekuensi Pemberian dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanwaktufrekuensi == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanwaktufrekuensi == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketwaktufrekuensi ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" colspan="3" style="border: 1px solid black;">Penelaah</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">({{ $ks->penelaahperacikan ?? '...............' }})</td>
                    </tr>
                </tbody>
            </table>

            <table style="margin-left: 20px; width: 340px; border: 1px solid black; margin-top: 5px;">
                <thead>
                    <tr>
                        <th class="description fs-9" style="border: 1px solid black;">Telaah Obat</th>
                        <th class="price fs-9" style="border: 1px solid black; width: 35px;">Ya</th>
                        <th class="price fs-9" style="border: 1px solid black; width: 35px;">Tidak</th>
                        <th class="description fs-9" style="border: 1px solid black; width: 120px;">Keterangan/Tindak Lanjut</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Identitas pasien</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanidentitas == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanidentitas == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketidentitas ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Nama Obat dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelannamaobat == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelannamaobat == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketnamaobat ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Jumlah/Dosis dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanjumlahdosis == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanjumlahdosis == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketjumlahdosis ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Rute dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanrute == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanrute == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketrute ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Waktu dan frekuensi Pemberian dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanwaktufrekuensi == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanwaktufrekuensi == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketwaktufrekuensi ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" colspan="3" style="border: 1px solid black;">Penelaah</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">({{ $ks->penelaahpelabelan ?? '...............' }})</td>
                    </tr>
                </tbody>
            </table>

            <table style="margin-left: 20px; width: 340px; border: 1px solid black; margin-top: 5px;">
                <thead>
                    <tr>
                        <th class="description fs-9" style="border: 1px solid black;">Telaah Obat</th>
                        <th class="price fs-9" style="border: 1px solid black; width: 35px;">Ya</th>
                        <th class="price fs-9" style="border: 1px solid black; width: 35px;">Tidak</th>
                        <th class="description fs-9" style="border: 1px solid black; width: 120px;">Keterangan/Tindak Lanjut</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Identitas pasien</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahkanidentitas == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahkanidentitas == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketidentitas ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Nama Obat dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahlahnamaobat == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahlahnamaobat == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketnamaobat ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Jumlah/Dosis dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanjumlahdosis == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanjumlahdosis == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketjumlahdosis ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Rute dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanrute == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanrute == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketrute ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" style="border: 1px solid black;">Waktu dan frekuensi Pemberian dengan resep</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanwaktufrekuensi == "Ya" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanwaktufrekuensi == "Tidak" ? '✓' : '' }}</td>
                        <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketwaktufrekuensi ?? '' }}</td>
                    </tr>
                    <tr>
                        <td class="fs-9" colspan="3" style="border: 1px solid black;">Penelaah</td>
                        <td class="fs-9" style="border: 1px solid black; text-align: center;">({{ $ks->penelaahdiserahkan ?? '...............' }})</td>
                    </tr>
                </tbody>
            </table>
            @endif
        </div>
        <div>
             @if($cetakkin == 4)
             <div class="print-copy">
                <div class="ticket">
                    <p class="centered fs-11" style="margin-top: 30px;"><b>RESEP</b>
                        <b><br>Rumah Sakit Jiwa Grhasia</b>
                        <br>Jl. Kaliurang KM.17, Pakembinangun, Kec. Pakem, Kab. Sleman, DIY
                    </p>

                    <table  style="border-top: none; margin-top: -10px;">
                        <tbody>
                            <tr>
                                <td class="price fs-9"><strong></strong></td>
                                <td class="description fs-9" style="text-align: left"></td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong></strong></td>
                                <td class="description fs-9" style="text-align: right"><b>CM.FM.02</b></td>
                            </tr>
                            <tr>
                                <td colspan="2" class="fs-13"><strong>No. Antrian: {{ $raw->noantri }}</strong></td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong></strong></td>
                                <td class=" fs-9" style="text-align: right" width="200"><b><u>RESEP {{ $raw->kelompokpasien }}</u></b></td>
                            </tr>
                        </tbody>
                    </table>

                    <p class="centered fs-13" style="margin-top: 0px;">No. Resep: {{$skrining->noresep}}</p>
                    <table>
                        <thead>
                            <tr>
                                <th class="quantity fs-13">R/</th>
                                <th class="description fs-13">Nama Obat</th>
                                <th class="description fs-13">Dosis</th>
                                <th class="price fs-13">Jumlah</th>
                                <th class="description fs-13">Signa</th>

                                {{-- <th class="price fs-13">Keterangan</th> --}}
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($details as $d){ ?>
                                <tr>
                                    <td class="price fs-13" style="text-align: center"><?= $d->rke; ?></td>
                                    <td class="price fs-13" style="text-align: left"><?= $d->namaproduk; ?></td>
                                    <td class="fs-13" style="text-align: center">{{ $d->dosis }}</td>
                                    <td class="price fs-13" style="text-align: center"><?= $d->jumlah; ?></td>
                                    <td class="price fs-13" style="text-align: center"><?= $d->catatandokter ?></td>
                                </tr>
                                <tr>
                                    <td colspan="2"></td>
                                    <td colspan="3" class="price fs-13" style="text-align: center"> <?= $d->keteranganpakai != '-' && $d->keteranganpakai != '' && $d->keteranganpakai != ' ' ? ' / '. $d->keteranganpakai : null ?></td>
                                </tr>
                            <?php } ?>
                            <tr style="height: 10px;"><td></td></tr>
                        </tbody>
                    </table>
                    <table style="margin-left: 20px;">
                        <tbody>
                            <tr>
                                <td class="price fs-9"><strong>Status Pembiayaan</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->kelompokpasien }}</td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong>Sumber Resep</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->ruangantujuan }}</td>
                            </tr>
                            <tr>
                                <td class="price fs-9"><strong>No. Rekam Medik</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->nocm }}</td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong>Tanggal Resep</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->tglorder }}</td>
                            </tr>
                            <tr>
                                <td class="price fs-9"><strong>Nama Pasien</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->namapasien }}</td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong>Nama Dokter</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->namalengkap }}</td>
                            </tr>
                            <tr>
                                <td class="price fs-9"><strong>Tgl Lahir</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->tgllahir }}</td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong>Jenis Kelamin</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->jeniskelamin }}</td>
                            </tr>
                            <tr>
                                <td class="price fs-9"><strong>Alergi</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->alergi }}</td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong>Ruangan Asal</strong></td>
                                <td class="description fs-9" style="text-align: left">: {{ $raw->ruanganasal }}</td>
                            </tr>
                            <tr>
                                <td class="price fs-9"><strong>No. SEP</strong></td>
                                <td class="description fs-9" style="text-align: left">: 
                                    @if (isset($raw->nosep))
                                        {{ $raw->nosep }}
                                    @endif
                                </td>
                                <td style="width: 10px;"><strong></strong></td>
                            </tr>
                            <tr style="height: 10px;"><td></td></tr>
                            <tr>
                                <td class="price fs-9"><strong></strong></td>
                                <td class="description fs-9" style="text-align: left"></td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong></strong></td>
                                <td class="price fs-9" style="text-align: center">Tanda Tangan Penerima</td>
                            </tr>
                            <tr style="height: 30px;"><td></td></tr>
                            <tr>
                                <td class="price fs-9"><strong></strong></td>
                                <td class="description fs-9" style="text-align: left"></td>
                                <td style="width: 10px;"><strong></strong></td>
                                <td class="price fs-9"><strong></strong></td>
                                <td class="price fs-9" style="text-align: center">(...............)</td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="centered fs-11" style="margin-top: -10px;">------Petugas Farmasi-----</p>
                    <table style="margin-left: 20px;">
                        <thead>
                            <tr>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                                    Penerima
                                    <br><br><br><br><br>
                                    ............
                                </td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                                    Penelaah Resep
                                    <br><br><br><br><br>
                                    ............
                                </td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                                    Peracik dan Penelaah Obat
                                    <br><br><br><br>
                                    ............
                                </td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                                    Penyerahan dan Informasi
                                    <br><br><br><br>
                                    ............
                                </td>
                            </tr>
                            
                        </thead>
                    </table>
                </div>
             </div>
             <div class="print-copy" style="margin-top: 20px">
                <div class="ticket">
                    <p class="fs-9" style="text-align: left; margin-top: 30px; margin-left: 20px">I. TELAAH RESEP</p>
                    <table style="margin-left: 20px;">
                        <thead>
                            <tr>
                                <th class="quantity fs-9" style="border: 1px solid black;">No.</th>
                                <th class="description fs-9" style="border: 1px solid black;">Uraian</th>
                                <th class="price fs-9" style="border: 1px solid black;">Ya</th>
                                <th class="price fs-9" style="border: 1px solid black;">Tidak</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">1.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Administrasi</td>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Nama, tanggal lahir, jenis kelamin, dan identitas pasien</td>
                                @if($skrining->rpenulis == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rpenulis == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Identitas dokter penulis resep dan paraf/keabsahan dokter</td>
                                @if($skrining->ridentitasdokter == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->ridentitasdokter == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tanggal resep</td>
                                @if($skrining->rtanggalresep == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rtanggalresep == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Cara Bayar Pasien</td>
                                @if($skrining->rcarabayar == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rcarabayar == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Ruang / unit asal resep</td>
                                @if($skrining->rruanganresep == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rruanganresep == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">2.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Farmasetis</td>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Nama obat, bentuk sediaan</td>
                                @if($skrining->rnamaobat == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rnamaobat == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Dosis dan jumlah obat</td>
                                @if($skrining->robat == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->robat == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Stabilitas dan inkompatibilitas sediaan</td>
                                @if($skrining->rstabilitas == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rstabilitas == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Aturan dan cara penggunaan</td>
                                @if($skrining->raturan == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->raturan == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">3.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Klinis</td>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Ketepatan indikasi, dosis, dan waktu penggunaan obat </td>
                                @if($skrining->rmr == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rmr == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Duplikasi pengobatan</td>
                                @if($skrining->rberatbedan == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rberatbedan == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Potensi Alergi/Hipertensitivitas dan Reaksi Obat yang Tidak Dikehendaki</td>
                                @if($skrining->ralergi == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->ralergi == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Interaksi antara obat dan obat lain atau dengan makanan</td>
                                @if($skrining->rinteraksi == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rinteraksi == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Variasi Kriteria penggunaan dari rumah sakit(PPK dan Formularium)</td>
                                @if($skrining->rvariasi == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rvariasi == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Berat badan, tinggi badan pasien dan atau informasi fisiologis lainnya (jika diperlukan)</td>
                                @if($skrining->rbeban == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rbeban == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center;"></td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Kontra Indikasi</td>
                                @if($skrining->rdokter == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rdokter == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                        </tbody>
                    </table>
                    <p class="fs-9" style="text-align: left; margin-left: 20px">II. TELAAH OBAT</p>
                    <table style="margin-left: 20px;">
                        <thead>
                            <tr>
                                <th class="quantity fs-9" style="border: 1px solid black;">No.</th>
                                <th class="description fs-9" style="border: 1px solid black;">Uraian</th>
                                <th class="price fs-9" style="border: 1px solid black;">Ya</th>
                                <th class="price fs-9" style="border: 1px solid black;">Tidak</th>
                            </tr>
                        </thead>
                        @if($skrining != null)
                        <tbody>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">1.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat pasien</td>
                                @if($skrining->rpasien == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rpasien == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">2.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat nama obat</td>
                                @if($skrining->rruang == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rruang == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">3.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat dosis dan jumlah obat</td>
                                @if($skrining->rstatusjamin == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rstatusjamin == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">4.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat rute pemberian</td>
                                @if($skrining->rjumlahobat == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rjumlahobat == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">5.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat waktu pemberian</td>
                                @if($skrining->rdatawaktu == 1)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @elseif($skrining->rdatawaktu == 2)
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                                @else
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                                @endif
                            </tr>
                        </tbody>
                    </table>
                    @if($skrining->ketskrining != null)
                    <p class="fs-9" style="text-align: left; margin-left: 20px">Ket: {{$skrining->ketskrining}}</p><br>
                    @else
                    <p class="fs-9" style="text-align: left; margin-left: 20px">Ket: </p><br>
                    @endif
                    @elseif($skrining == null)
                    <table style="margin-left: 20px">
                        <tbody>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">1.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Obat Sesuai</td>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">2.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Dosis</td>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">3.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Jumlah</td>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">4.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Frekuensi</td>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                            </tr>
                            <tr>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;">5.</td>
                                <td class="price fs-9" style="text-align: left; border: 1px solid black;">Rute</td>
                                <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                                <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="fs-9" style="text-align: left; margin-left: 20px">Ket: </p>
                    @endif
                </div>
             </div>
             <div class="print-copy" style="margin-top: 20px">
                <div class="ticket">
                    <p class="fs-9" style="text-align: center; margin-top: 20px;"><strong>Verifikasi Kesesuaian Obat</strong></p>
                    @php $ks = $ks_obat ?: (object)[]; @endphp
                    <table style="margin-left: 20px; width: 340px; border: 1px solid black;">
                        <thead>
                            <tr>
                                <th class="description fs-9" style="border: 1px solid black;">Telaah Obat</th>
                                <th class="price fs-9" style="border: 1px solid black; width: 35px;">Ya</th>
                                <th class="price fs-9" style="border: 1px solid black; width: 35px;">Tidak</th>
                                <th class="description fs-9" style="border: 1px solid black; width: 120px;">Keterangan/Tindak Lanjut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Identitas pasien</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanidentitas == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanidentitas == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketidentitas ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Nama Obat dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapannamaobat == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapannamaobat == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketnamaobat ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Jumlah/Dosis dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanjumlahdosis == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanjumlahdosis == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketjumlahdosis ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Rute dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanrute == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanrute == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketrute ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Waktu dan frekuensi Pemberian dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanwaktufrekuensi == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->penyiapanwaktufrekuensi == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->penyiapanketwaktufrekuensi ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" colspan="3" style="border: 1px solid black;">Penelaah</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">({{ $ks->penelaahpenyiapan ?? '...............' }})</td>
                            </tr>
                        </tbody>
                    </table>

                    <table style="margin-left: 20px; width: 340px; border: 1px solid black; margin-top: 5px;">
                        <thead>
                            <tr>
                                <th class="description fs-9" style="border: 1px solid black;">Telaah Obat</th>
                                <th class="price fs-9" style="border: 1px solid black; width: 35px;">Ya</th>
                                <th class="price fs-9" style="border: 1px solid black; width: 35px;">Tidak</th>
                                <th class="description fs-9" style="border: 1px solid black; width: 120px;">Keterangan/Tindak Lanjut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Identitas pasien</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanidentitas == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanidentitas == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketidentitas ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Nama Obat dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikannamaobat == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikannamaobat == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketnamaobat ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Jumlah/Dosis dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanjumlahdosis == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanjumlahdosis == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketjumlahdosis ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Rute dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanrute == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanrute == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketrute ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Waktu dan frekuensi Pemberian dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanwaktufrekuensi == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->peracikanwaktufrekuensi == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->peracikanketwaktufrekuensi ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" colspan="3" style="border: 1px solid black;">Penelaah</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">({{ $ks->penelaahperacikan ?? '...............' }})</td>
                            </tr>
                        </tbody>
                    </table>

                    <table style="margin-left: 20px; width: 340px; border: 1px solid black; margin-top: 5px;">
                        <thead>
                            <tr>
                                <th class="description fs-9" style="border: 1px solid black;">Telaah Obat</th>
                                <th class="price fs-9" style="border: 1px solid black; width: 35px;">Ya</th>
                                <th class="price fs-9" style="border: 1px solid black; width: 35px;">Tidak</th>
                                <th class="description fs-9" style="border: 1px solid black; width: 120px;">Keterangan/Tindak Lanjut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Identitas pasien</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanidentitas == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanidentitas == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketidentitas ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Nama Obat dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelannamaobat == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelannamaobat == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketnamaobat ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Jumlah/Dosis dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanjumlahdosis == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanjumlahdosis == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketjumlahdosis ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Rute dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanrute == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanrute == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketrute ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Waktu dan frekuensi Pemberian dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanwaktufrekuensi == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->pelabelanwaktufrekuensi == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->pelabelanketwaktufrekuensi ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" colspan="3" style="border: 1px solid black;">Penelaah</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">({{ $ks->penelaahpelabelan ?? '...............' }})</td>
                            </tr>
                        </tbody>
                    </table>

                    <table style="margin-left: 20px; width: 340px; border: 1px solid black; margin-top: 5px;">
                        <thead>
                            <tr>
                                <th class="description fs-9" style="border: 1px solid black;">Telaah Obat</th>
                                <th class="price fs-9" style="border: 1px solid black; width: 35px;">Ya</th>
                                <th class="price fs-9" style="border: 1px solid black; width: 35px;">Tidak</th>
                                <th class="description fs-9" style="border: 1px solid black; width: 120px;">Keterangan/Tindak Lanjut</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Identitas pasien</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahkanidentitas == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahkanidentitas == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketidentitas ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Nama Obat dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahlahnamaobat == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahlahnamaobat == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketnamaobat ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Jumlah/Dosis dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanjumlahdosis == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanjumlahdosis == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketjumlahdosis ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Rute dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanrute == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanrute == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketrute ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" style="border: 1px solid black;">Waktu dan frekuensi Pemberian dengan resep</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanwaktufrekuensi == "Ya" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">{{ $ks->diserahanwaktufrekuensi == "Tidak" ? '✓' : '' }}</td>
                                <td class="fs-9" style="border: 1px solid black;">{{ $ks->diserahlanketwaktufrekuensi ?? '' }}</td>
                            </tr>
                            <tr>
                                <td class="fs-9" colspan="3" style="border: 1px solid black;">Penelaah</td>
                                <td class="fs-9" style="border: 1px solid black; text-align: center;">({{ $ks->penelaahdiserahkan ?? '...............' }})</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
             </div>
             @endif
        </div>
    </body>
</html>
<script>
    window.onload = function() {
        window.print();
    };
    // window.onafterprint = function() {
    //     window.close();
    // };
</script>