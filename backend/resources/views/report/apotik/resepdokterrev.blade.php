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
                        <td class="price fs-9"><strong></strong></td>
                        <td class="description fs-9" style="text-align: left"></td>
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
                        <td class="description fs-9" style="text-align: left">: {{ $raw->nosep }}</td>
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
    </body>
</html>
<script>
    window.print();
</script>