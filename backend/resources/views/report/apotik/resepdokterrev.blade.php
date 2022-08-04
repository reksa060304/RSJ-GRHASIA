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
                font-family: 'Times New Roman';
            }

            .fs-9{
                font-size: 7px;
                font-family: 'Times New Roman';
            }

            
            th,
            table {
                border-top: 1px solid black;
                border-collapse: collapse;
            }

            td.description,
            th.description {
                width: 75px;
                max-width: 75px;
            }

            td.quantity,
            th.quantity {
                width: 40px;
                max-width: 40px;
                word-break: break-all;
            }

            td.price,
            th.price {
                width: 40px;
                max-width: 40px;
            }

            .centered {
                text-align: center;
                align-content: center;
            }

            .ticket {
                width: 155px;
                max-width: 155px;
            }

            @media print {
                .hidden-print,
                .hidden-print * {
                    display: none !important;
                }
            }

            @page {
                margin-left: -5px;
                margin-top: -5px;
            }
        </style>
    </head>
    <body>
        <div class="ticket">
            <p class="centered fs-11"><b>RESEP</b>
                <b><br>Rumah Sakit Jiwa Grhasia</b>
                <br>{{ $profile[0]->alamatlengkap }}
                <br>Telp.  {{ $profile[0]->fixedphone }} Fax. {{ $profile[0]->faksimile }}
            </p>

            <table  style="border-top: none">
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
            </table><br>

            <p class="centered fs-9">------Resep-----</p>
            <table>
                <thead>
                    <tr>
                        <th class="quantity fs-9">R/</th>
                        <th class="description fs-9">Nama Obat</th>
                        <th class="price fs-9">Jumlah</th>
                        <th class="price fs-9">Aturan Pakai</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($details as $d){ ?>
                        <tr>
                            <td class="price fs-9" style="text-align: center"><?= $d->rke; ?></td>
                            <td class="price fs-9" style="text-align: left"><?= $d->namaproduk; ?></td>
                            <td class="price fs-9" style="text-align: center"><?= $d->jumlah; ?></td>
                            <td class="description fs-9" style="text-align: center"><?= $d->aturanpakai; ?></td>
                        </tr>
                    <?php } ?>
                    <tr style="height: 10px;"><td></td></tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center"></td>
                        <td class="quantity fs-9" style="text-align: left"></td>
                        <td class="price fs-9" style="text-align: center"></td>
                        <td class="price fs-9" style="text-align: center">Paraf Dokter</td>
                    </tr>
                    <tr style="height: 30px;"><td></td></tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center"></td>
                        <td class="quantity fs-9" style="text-align: left"></td>
                        <td class="price fs-9" style="text-align: center"></td>
                        <td class="price fs-9" style="text-align: center">({{ $raw->namalengkap }})</td>
                    </tr>
                </tbody>
            </table><br>

            <p class="fs-9" style="text-align: left">I. TELAAH RESEP</p>
            <table>
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
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">2.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Farmasetis</td>
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
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">3.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Klinis</td>
                        @if($skrining->rklinis == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rklinis == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat Dosis</td>
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
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat Rute</td>
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
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Tepat Waktu</td>
                        @if($skrining->rtanggallahir == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rtanggallahir == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center;"></td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Duplikasi</td>
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
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Kontra-indikasi</td>
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
            </table><br>

            <p class="fs-9" style="text-align: left">II. TELAAH OBAT</p>
            <table>
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
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Obat Sesuai</td>
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
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">2.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Dosis</td>
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
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">3.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Jumlah</td>
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
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">4.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Frekuensi</td>
                        @if($skrining->rkekuatan == 1)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @elseif($skrining->rkekuatan == 2)
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">✓</td>
                        @else
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;"></td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;"></td>
                        @endif
                    </tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center; border: 1px solid black;">5.</td>
                        <td class="price fs-9" style="text-align: left; border: 1px solid black;">Rute</td>
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
                </tbody>
            </table>
            @if($skrining->ketskrining != null)
            <p class="fs-9" style="text-align: left">Ket: {{$skrining->ketskrining}}</p><br>
            @else
            <p class="fs-9" style="text-align: left">Ket: </p><br>
            @endif
            @elseif($skrining == null)
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
            <p class="fs-9" style="text-align: left">Ket: </p><br>
            @endif
            
            <p class="centered fs-9">------Identitas Pasien-----</p>
            <table>
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
                </tbody>
            </table><br>
            
            
            
            <p class="centered fs-9">------Petugas Farmasi-----</p>
            <table>
                <thead>
                    <tr>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                            Penerima
                            <br><br><br><br><br>
                            ............
                        </td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                            Penelaah Resep
                            <br><br><br><br>
                            ............
                        </td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                            Peracik dan Penelaah Obat
                            <br><br><br>
                            ............
                        </td>
                        <td class="description fs-9" style="text-align: center; border: 1px solid black;">
                            Penyerahan dan Informasi
                            <br><br><br><br>
                            ............
                        </td>
                    </tr>
                    <tr style="height: 10px;"><td></td></tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center"></td>
                        <td class="quantity fs-9" style="text-align: left"></td>
                        <td class="price fs-9" style="text-align: center"></td>
                        <td class="price fs-9" style="text-align: center">Tanda Tangan Penerima</td>
                    </tr>
                    <tr style="height: 30px;"><td></td></tr>
                    <tr>
                        <td class="price fs-9" style="text-align: center"></td>
                        <td class="quantity fs-9" style="text-align: left"></td>
                        <td class="price fs-9" style="text-align: center"></td>
                        <td class="price fs-9" style="text-align: center">(...............)</td>
                    </tr>
                </thead>
            </table>
        </div>
    </body>
</html>
<script>
    window.print();
</script>