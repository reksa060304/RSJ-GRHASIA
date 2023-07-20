@php
    $reportcontroller = new \App\Http\Controllers\Report\ReportController();
    // $indexData = $homeController->index();
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Daftar Obat Pulang</title>
    <link rel="stylesheet" href="css/report/paper.css">
    <link rel="stylesheet" href="css/report/table.css">
    <link rel="stylesheet" href="css/report/tabel.css">

    <link href="css/style.css" rel="stylesheet">
<style>
  * {
    font-family: Arial, sans-serif;
  }
  .box {
            border: 2px solid black;
            /*border-radius: 6px;*/
        }
</style>

</head>
<body>
    <section style="font-family:Arial;padding:5mm 5mm 5mm 5mm">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody >
                    <tr >
                        <td width="10%" style="padding: 0px">
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 80px;">
                                <br>
                                {{-- <b style="">
                                    RSJ GRHASIA
                                </b> --}}
                        </td>
                        <td width="60%" style="text-align: center; line-height: normal;">
                            <br>
                            <span style="font-size: 6pt;font-weight: normal;letter-spacing: normal;">{!! $res['profile']->baris1 !!}</span>
                                <br>
                                <span style="font-size: 8pt; font-weight: normal;letter-spacing: normal">{!! $res['profile']->baris2 !!}</span>
                                <br>
                                <span style="font-size: 7pt; font-weight: normal">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                                <br>
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 100px;">
                                <br>
                                <span style="font-size: 6pt; font-weight: normal">Jl.  Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}, 895297 Faksimile : {{$res['profile']->faksimile}}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                                
                                </span>
                        </td>
                        <td width="50%" style="padding: 5px">
                            <b style="text-align: center">
                                DAFTAR OBAT PULANG
                            </b>
                            <div class="box" style="text-align: left; font-size: 8pt">
                                <table style="padding: 3px;font-size: 8pt">
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 50px; font-size: 8pt">No. RM</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">:</td>
                                        <td class="f-s-15 bold text-top" style="font-size: 8pt">{{ $data[0]->nocm }}</td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 50px; font-size: 8pt">Nama</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">:</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">{{ $data[0]->namapasien }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 50px; font-size: 8pt">Tgl Lahir</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">:</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">
                                            {{ $reportcontroller->tanggal_indonesia(date('Y-m-d', strtotime($data[0]->tgllahir))) }}
                                            
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <hr style="border:0.5px solid #000;margin-bottom:0.1px">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table width="100%" >
                <tr>
                    <td style="font-size: 8pt">Ruang Rawat Wisma : </td>
                    <td style="font-size: 8pt">{{$data[0]->namaruangan}}</td>
                    <td style="font-size: 8pt">Nama Dokter : </td>
                    <td style="font-size: 8pt">{{$data[0]->namadokter}}</td>
                </tr>
            </table>
            <table width="100%" border="1" cellspacing="0" cellpadding="0">
                <tr>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">NO</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">NAMA OBAT</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">ATURAN PAKAI</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">PAGI</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">SIANG</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">SORE</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">MALAM</th>
                </tr>
                @php
                    $i=1;
                @endphp
                @foreach ($data as $d)
                    <tr>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">{{$i++}}</th>
                        <td style="font-weight: normal; font-size: 8pt; padding:2px">{{$d->namaproduk}}</td>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">{{$d->keteranganpakai}}</th>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">@if($d->ispagi == true)<img src="img/checlist.png" alt="" width="10px">@else - @endif</th>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">@if($d->issiang == true)<img src="img/checlist.png" alt="" width="10px">@else - @endif</th>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">@if($d->issore == true)<img src="img/checlist.png" alt="" width="10px">@else - @endif</th>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">@if($d->ismalam == true)<img src="img/checlist.png" alt="" width="10px">@else - @endif</th>
                    </tr>
                @endforeach
            </table>
            <table width="100%">
                <tr>
                    <td>
                        CATATAN
                        <br>
                        Resep obat pulang ada {{count($data)}} ({{$reportcontroller->bilanganSebut(count($data))}}) macam
                        <br>
                        Waktu minum obat yang disarankan : 
                        <br>
                        Jika 1 x sehari : Tiap 24 jam
                        <br>
                        Jika 2 x sehari : Tiap 12 jam. jam 06:00 dan 18:00
                        <br>
                        Jika 3 x sehari : Tiap 8 jam. jam 06:00 ; 14:00 ; dan 22:00
                        <br>
                        Obat diminum rutin sesuai aturan pakai dengan air putih. <br>Kontrol kembali sebelum
                    obat habis atau sesuai dengan surat Ringkasan Pulang. <br> 
                    Pantau apabila terjadi efek samping obat.
                    </td>
                </tr>
            </table>
            <table width="100%" style="text-align: center">
                <tr>
                    <td>Tanggal : {{$reportcontroller->tanggal_indonesia(date('Y-m-d'))}}</td>
                    <td>Jam : {{date('H:i')}}</td>
                </tr>
                <tr>
                    <td>Pemberi Informasi : </td>
                    <td></td>
                    <td>Yang Menerima Informasi : </td>
                </tr>
                <tr>
                    <td height="30px"></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td> {{$peg1->namalengkap}}</td>
                    <td></td>
                    <td>(____________________)</td>
                </tr>
            </table>
            <hr style="border:0.5px solid #000;margin-bottom:0.1px">
    </section>
    <section style="font-family:Arial;padding:5mm 5mm 5mm 5mm">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody >
                    <tr >
                        <td width="10%" style="padding: 0px">
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 80px;">
                                <br>
                                {{-- <b style="">
                                    RSJ GRHASIA
                                </b> --}}
                        </td>
                        <td width="60%" style="text-align: center; line-height: normal;">
                            <br>
                            <span style="font-size: 6pt;font-weight: normal;letter-spacing: normal;">{!! $res['profile']->baris1 !!}</span>
                                <br>
                                <span style="font-size: 8pt; font-weight: normal;letter-spacing: normal">{!! $res['profile']->baris2 !!}</span>
                                <br>
                                <span style="font-size: 7pt; font-weight: normal">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                                <br>
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 100px;">
                                <br>
                                <span style="font-size: 6pt; font-weight: normal">Jl.  Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}, 895297 Faksimile : {{$res['profile']->faksimile}}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                                
                                </span>
                        </td>
                        <td width="50%" style="padding: 5px">
                            <b style="text-align: center">
                                DAFTAR OBAT PULANG
                            </b>
                            <div class="box" style="text-align: left; font-size: 8pt">
                                <table style="padding: 3px;font-size: 8pt">
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 50px; font-size: 8pt">No. RM</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">:</td>
                                        <td class="f-s-15 bold text-top" style="font-size: 8pt">{{ $data[0]->nocm }}</td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 50px; font-size: 8pt">Nama</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">:</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">{{ $data[0]->namapasien }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 50px; font-size: 8pt">Tgl Lahir</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">:</td>
                                        <td class="f-s-15 bold  text-top" style="font-size: 8pt">
                                            {{ $reportcontroller->tanggal_indonesia(date('Y-m-d', strtotime($data[0]->tgllahir))) }}
                                            
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <hr style="border:0.5px solid #000;margin-bottom:0.1px">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table width="100%" >
                <tr>
                    <td style="font-size: 8pt">Ruang Rawat Wisma : </td>
                    <td style="font-size: 8pt">{{$data[0]->namaruangan}}</td>
                    <td style="font-size: 8pt">Nama Dokter : </td>
                    <td style="font-size: 8pt">{{$data[0]->namadokter}}</td>
                </tr>
            </table>
            <table width="100%" border="1" cellspacing="0" cellpadding="0">
                <tr>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">NO</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">NAMA OBAT</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">ATURAN PAKAI</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">PAGI</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">SIANG</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">SORE</th>
                    <th style="font-weight: normal; font-size: 8pt; padding:3px">MALAM</th>
                </tr>
                @php
                    $i=1;
                @endphp
                @foreach ($data as $d)
                    <tr>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">{{$i++}}</th>
                        <td style="font-weight: normal; font-size: 8pt; padding:2px">{{$d->namaproduk}}</td>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">{{$d->keteranganpakai}}</th>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">@if($d->ispagi == true)<img src="img/checlist.png" alt="" width="10px">@else - @endif</th>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">@if($d->issiang == true)<img src="img/checlist.png" alt="" width="10px">@else - @endif</th>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">@if($d->issore == true)<img src="img/checlist.png" alt="" width="10px">@else - @endif</th>
                        <th style="font-weight: normal; font-size: 8pt; padding:2px">@if($d->ismalam == true)<img src="img/checlist.png" alt="" width="10px">@else - @endif</th>
                    </tr>
                @endforeach
            </table>
            <table width="100%">
                <tr>
                    <td>
                        CATATAN
                        <br>
                        Resep obat pulang ada {{count($data)}} ({{$reportcontroller->bilanganSebut(count($data))}}) macam
                        <br>
                        Waktu minum obat yang disarankan : 
                        <br>
                        Jika 1 x sehari : Tiap 24 jam
                        <br>
                        Jika 2 x sehari : Tiap 12 jam. jam 06:00 dan 18:00
                        <br>
                        Jika 3 x sehari : Tiap 8 jam. jam 06:00 ; 14:00 ; dan 22:00
                        <br>
                        Obat diminum rutin sesuai aturan pakai dengan air putih. <br>Kontrol kembali sebelum
                    obat habis atau sesuai dengan surat Ringkasan Pulang. <br> 
                    Pantau apabila terjadi efek samping obat.
                    </td>
                </tr>
            </table>
            <table width="100%" style="text-align: center">
                <tr>
                    <td>Tanggal : {{$reportcontroller->tanggal_indonesia(date('Y-m-d'))}}</td>
                    <td>Jam : {{date('H:i')}}</td>
                </tr>
                <tr>
                    <td>Pemberi Informasi : </td>
                    <td></td>
                    <td>Yang Menerima Informasi : </td>
                </tr>
                <tr>
                    <td height="30px"></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td> {{$peg1->namalengkap}}</td>
                    <td></td>
                    <td>(____________________)</td>
                </tr>
            </table>
            {{-- <hr style="border:0.5px solid #000;margin-bottom:0.1px"> --}}
    </section>
</body>
</html>