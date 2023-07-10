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
    <title>Rekonsiliasi Obat</title>
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
                        <td width="5%" style="padding: 0px">
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 90px;">
                                <br>
                                {{-- <b style="">
                                    RSJ GRHASIA
                                </b> --}}
                        </td>
                        <td width="40%" style="text-align: center; line-height: normal;">
                            <br>
                            <span style="font-size: 10pt;font-weight: bold;letter-spacing: normal;">{!! $res['profile']->baris1 !!}</span>
                                <br>
                                <span style="font-size: 12pt; font-weight: bold;letter-spacing: normal">{!! $res['profile']->baris2 !!}</span>
                                <br>
                                <span style="font-size: 10pt; font-weight: bold">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                                <br>
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 150px;">
                                <br>
                                <span style="font-size: 8pt; font-weight: normal">Jl.  Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}, 895297 Faksimile : {{$res['profile']->faksimile}}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                                
                                </span>
                        </td>
                        <th width="20%"style="font-size: 10pt;font-weight: bold;">
                            FORM RIWAYAT PENGGUNAAN DAN REKONSILIASI OBAT 
                        </th>
                        <td width="30%" style="padding: 10px">
                            <div class="box" style="text-align: left; font-size: 8pt">
                                <table style="padding: 3px;">
                                    <tr>
                                        <td class="f-s-15 bold  text-top" style="width: 100px">No. RM</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold text-top"><b>{{ $res['datapasien']->nocm }}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Nama</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{{ $res['datapasien']->namapasien }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Jenis Kelamin</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{{ $res['datapasien']->jeniskelamin }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Tgl Lahir</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{{ $reportcontroller->tanggal_indonesia(date('Y-m-d', strtotime($res['datapasien']->tgllahir))) }}</b>
                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Ruangan</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{{ $res['datapasien']->namaruangan }}</b>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <hr style="border:1px solid #000;margin-bottom:0px">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table width="100%">
                <tr>
                    <td style="font-weight: bold;font-size: 10pt">DATA PASIEN</td>
                </tr>
                <tr>
                    <td style="font-size: 10pt">Tanggal Masuk RS : {{$item[100500]}}</td>
                    <td></td>
                    <td style="text-align: right; font-size: 10pt" >DPJP : {{$item[100508]}}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <td style="font-size: 10pt">{{isset($item[100501]) && $item[100501] == true ? 'Tidak Ada Riwayat Alergi': 'Ada Riwayat Alergi'}} </td>
                    <td style="font-size: 10pt"> {{isset($item[100501]) && $item[100501] != true ? 'Riwayat Alergi / Intoleransi (Sebutkan) : ': null}}</td>
                </tr>
            </table>
            <table cellspacing="0" cellpadding="0" border="1" width="100%" style="font-size: 10pt">
                <tr>
                    <th>No</th>
                    <th>Nama obat / suplemen / herbal / tradisional </th>
                    <th>Reaksi Alergi</th>
                </tr>
                @php
                    $aa=1;
                    $pp=1;
                @endphp
                @foreach ($alergi as $a)
                    <tr>
                        <td>{{$aa++}}</td>
                        <td>{{$a->objectprodukfk}}</td>
                        <td>{{$a->reaksialergi}}</td>
                    </tr>
                @endforeach
            </table>
            <br>
            <table style="font-size: 10pt" width="100%">
                <tr>
                    <td style="font-weight: bold; ">Riwayat Penggunaan Obat</td>
                </tr>
            </table>
            <table cellspacing="0" cellpadding="0" border="1" width="100%" style="font-size: 10pt">
                <tr>
                    <th rowspan="2">No</th>
                    <th rowspan="2">Nama obat / suplemen / herbal / tradisional dan dosis</th>
                    <th colspan="2">Jenis Obat</th>
                    <th colspan="2">Tanggal</th>
                    <th rowspan="2">Rute</th>
                    <th rowspan="2">Aturan Pakai</th>
                    <th rowspan="2">Indikasi</th>
                    <th rowspan="2">Status Obat Saat Admisi</th>
                    <th rowspan="2">Perubahan aturan pakai</th>
                </tr>
                <tr>
                    <th>Resep</th>
                    <th>Tanpa</th>
                    <th>Mulai</th>
                    <th>Stop</th>
                </tr>
                @foreach ($penggunaan as $p)
                    <tr>
                        <td>{{$pp++}}</td>
                        <td>{{$p->namaproduk}}</td>
                        <td style="text-align: center">@if($p->isresep == true)  <img src="img/checlist.png" alt=""width="10px"> @endif</td>
                        <td style="text-align: center">@if($p->isresep == null)  <img src="img/checlist.png" alt=""width="10px"> @endif</td>
                        <td style="text-align: center">{{$p->tanggalmulai}}</td>
                        <td style="text-align: center">{{$p->tanggalstop}}</td>
                        <td style="text-align: center">{{$p->rute}}</td>
                        <td style="text-align: center">{{$p->frekuensi}}</td>
                        <td style="text-align: center">{{$p->indikasi}}</td>
                        <td style="text-align: center">{{$p->statusobat}}</td>
                        <td>{{$p->perubahanaturan}}</td>
                    </tr>
                @endforeach
            </table>
            <br>
            <table width="100%" style="page-break-after: always;font-size: 10pt">
                <tr>
                    <td style="font-weight: bold">Sumber Informasi Obat</td>
                </tr>
                <tr>
                    <td> @if( isset($item[100502])&&$item[100502] == true)  <img src="img/checlist.png" alt=""width="10px"> @endif {{ isset($item[100502])&&$item[100502] == true ? 'RM Pasien':null}}</td>
                </tr>
                <tr>
                    <td> @if( isset($item[100503])&&$item[100503] == true)  <img src="img/checlist.png" alt=""width="10px"> @endif {{ isset($item[100503])&&$item[100503] == true? 'Pasien/Keluarga Pasien, Nama : ': null}} {{ isset($item[100503])&&$item[100503] == true ? $item[100504] : null}}</td>
                </tr>
                <tr>
                    <td> @if(isset($item[100505])&&$item[100505] == true)  <img src="img/checlist.png" alt=""width="10px"> @endif {{ isset($item[100505])&& $item[100505] == true? 'Lainnya, Sebutkan : ': null}} {{ isset($item[100505])&&$item[100505] == true ? $item[100506] : null}}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold"><br> Apoteker</td>
                </tr>
                <tr>
                    <td>{{$item[100507]}}</td>
                </tr>
            </table>
            <table width="100%" >
                <tr>
                    <td style="font-weight: bold; font-size: 10pt" >Rekonsiliasi Obat</td>
                </tr>
            </table>
            <table cellspacing="0" cellpadding="0" border="1" width="100%">
                <tr>
                    <th rowspan="2">Tanggal</th>
                    <th rowspan="2">Unit</th>
                    <th rowspan="2">Nama obat / suplemen / herbal / tradisional dan dosis </th>
                    <th rowspan="2">Rute</th>
                    <th rowspan="2">Aturan Pakai</th>
                    <th colspan="2">Tindak lanjut oleh DPJP</th>
                    <th rowspan="2">Tanda Tangan Apoteker</th>
                </tr>
                <tr>
                    <th>Status Obat</th>
                    <th>Perubahan Aturan Pakai</th>
                </tr>
                @foreach ($rekon as $r)
                    <tr>
                        <td>{{$r->tanggal}}</td>
                        <td>{{$r->namaruangan}}</td>
                        <td>{{$r->namaproduk}}</td>
                        <td style="text-align: center">{{$r->rute}}</td>
                        <td style="text-align: center">{{$r->aturanpakai}}</td>
                        <td style="text-align: center">{{$r->statusobat}}</td>
                        <td>{{$r->perubahanaturanpakai}}</td>
                        <td>{{$r->namalengkap}}</td>
                    </tr>
                @endforeach
            </table>
    </section>
</body>
</html>