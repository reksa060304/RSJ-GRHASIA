<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Pulang</title>
    {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">
    {{-- @else
        <link rel="stylesheet" href="service/css/report/paper.css">
        <link rel="stylesheet" href="service/css/report/table.css">
        <link rel="stylesheet" href="service/css/report/tabel.css">

        <link href="service/css/style.css" rel="stylesheet">
    @endif --}}

    <style>
        /* Padding for the header on the first page */
        @page :first {
            margin: 10mm;
        }

        /* Padding for the header on subsequent pages */
        @page {
            margin: 10mm;
            margin: 10mm;

        }
        .footer {
            text-align: center;
            position: fixed;
            bottom: 0;
        }
        .footer2 {
            text-align: center;
            position: relative;
            /* left: 67%; */
           
            bottom: 0%;
            /* right: 3%; */
        }

        
        
    </style>
</head>
<body>
    <section style="font-family:Arial;padding:5mm">
        <table cellspacing="0" cellpadding="0" border="1" width="100%">
            <tr>
                <td style="text-align: center" width="60%">
                    <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px;"><br>
                    <span style="font-size: 10pt;font-weight: bold;letter-spacing: normal;">{!! $res['profile']->baris1 !!}</span>
                    <br>
                    <span style="font-size: 12pt; font-weight: bold;letter-spacing: normal">{!! $res['profile']->baris2 !!}</span>
                    <br>
                    <span style="font-size: 10pt; font-weight: bold">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                    <br>
                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 120px;">
                    <br>
                    <span style="font-size: 7pt; font-weight: normal">Jl.  Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}, 895297 Faksimile : {{$res['profile']->faksimile}}
                    <br style="margin: 0px">
                    Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                    
                    </span>
                </td>
                <td width="40%">
                    <div class="box" style="text-align: left">
                        <table style="padding: 1px;">
                            <tr>
                                <td class="f-s-15 bold  text-top" style="width: 100px">No. RM</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold text-top"><b>{!! $res['d']['nocm']  !!}</b></td>
                            </tr>
                            <tr>
                                <td class="f-s-15 bold  text-top">Nama</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold  text-top"><b>{!!  $res['d']['namapasien']  !!}</b>
                                </td>
                            </tr>
                            <tr>
                                <td class="f-s-15 bold  text-top">Jenis Kelamin</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold  text-top">
                                    <b>{!!  $res['d']['jeniskelamin']   !!}</b></td>
                            </tr>
                            <tr>
                                <td class="f-s-15 bold  text-top">Tgl Lahir</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold  text-top">
                                    <b>{!! date('d-m-Y',strtotime( $res['d']['tgllahir']  )) !!}</b></td>
                            </tr>
                            <tr>
                                <td class="f-s-15 bold  text-top">Ruangan</td>
                                <td class="f-s-15 bold  text-top">:</td>
                                <td class="f-s-15 bold  text-top"><b>{!! $res['d']['namaruangan']  !!}</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
            <tr>
                <th colspan="2">
                    RINGKASAN PULANG NON JIWA
                </th>
            </tr>
            <tr>
                <td colspan="2">
                    <table width="100%">
                        <tr width="100%">
                            <td style="font-weight: bold">Tanggal Masuk</td>
                            <td style="font-weight: bold">Tanggal Pulang</td>
                            <td style="font-weight: bold">Wisma</td>
                            <td style="font-weight: bold">Kelas</td>
                        </tr>
                        <tr width="100%">
                            <td>{!! $res['d']['tglmasuk'] !!}</td>
                            <td>{!! $res['d']['tglpulang']  != null?$res['d']['tglpulang'] :'-'!!}</td>
                            <td>{!! $res['d']['wisma'] !!}</td>
                            <td>{!! $res['d']['kelas'] !!}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:5px;vertical-align: top">
                    <table >
                        <tr>
                            <td style="font-weight:bold;padding:2px;">Indikasi Dirawat : </td>
                            <td>{!! $res['d']['indikasi'] !!}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold;padding:2px;">Diagnosa Masuk : </td>
                            <td style="white-space: pre-line;">{!! $res['d']['diagnosismasuk'] .', '.$res['d']['kddiagnosismasuk'][2] !!}</td>
                        </tr>
                    </table>
                </td>
                <td style="white-space: pre-line; padding:2px">
                    <b>Hasil Pemeriksaan Fisik</b><br>
                    <div style="padding:2px">
                        {!! $res['d']['pemeriksaanfisik'] !!}
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:2px">
                    <b>Riwayat Kesehatan</b><br>
                    <div style="padding:2px">
                        {!! $res['d']['riwayatlalu'] !!}
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:2px">
                    <b>Alergi</b>
                    <br>
                    @if ($res['d']['ralergi'] == 1)
                    <div style="padding:2px">
                       Tidak
                    </div> 
                    @else
                    Ya, {!! $res['d']['alergi'] !!}
                    @endif
                
                </td>
            </tr>
            {{-- <tr>
                <td colspan="2" style="padding:10px">
                    <b>Alergi</b><br>
                    <div style="padding:5px">
                        {!! $res['d']['alergi'] !!}
                    </div>
                </td>
            </tr> --}}
            <tr>
                <td colspan="2" style="padding:2px">
                    <b>Pemeriksaan Diagnostik / Penunjang</b><br>
                    <table cellspacing="0" cellpadding="0" border="1" width="100%" style="padding:10px">
                        <tr>
                            <td>Hasil Laboratorium</td>
                            <td>Hasil Radiologi</td>
                        </tr>
                        <tr style="padding:5px">
                            <td style="vertical-align: top">
                                <ul >
                                    @foreach ($res['d']['data5lab'] as $item)
                                    <li>
                                        Tgl: {{$item->tglpelayanan}}. Detail Pemeriksaan : {{$item->detailpemeriksaan}}. Hasil : {{$item->hasil}}
                                    </li>
                                    @endforeach
                                </ul>
                            </td>
                            <td style="vertical-align: top">
                                <ul style="list-style-type: none">
                                    @foreach ($res['d']['data5rad'] as $item)
                                    @php
                                        $item->aaaaa = '';
                                        $item->wkwkw = explode("Kesan", $item->keterangan);
                                        $item->ccccc = "Kesan: " . str_replace("~", "\n", $item->wkwkw[1]);
                                        $item->bbbbb = "\n" . $item->ccccc;
                                        $item->aaaaa = $item->aaaaa . $item->bbbbb;
                                        @endphp
                                    <li>
                                        {{$item->aaaaa}}
                                    </li>
                                    @endforeach
                                </ul>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
           
            <tr>
                <td colspan="2" style="padding:2px">
                    <table width="100%">
                        <tr>
                            <td style="font-weight: bold">Diagnosa Akhir</td>
                            <td style="font-weight: bold">Kode ICD</td>
                        </tr>
                        @php
                            $diagnosatambahan = explode(", ", $res['d']['kddiagnosistambahanall']);
                            // dd($diagnosatambahan);
                        @endphp
                        <tr>
                            <td>{!! $res['d']['diagnosisawal'] !!}</td>
                            <td>1. {!! $res['d']['kddiagnosisawal'][1] !!}</td>
                        </tr>
                        <tr>
                            <td>{!! $res['d']['axis2'] !!}</td>
                            <td>2. {!! $res['d']['kddiagnosistambahan'][1] !!}</td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:2px">
                    <b>Tindakan Diagnostik dan Prosedur Terapi :</b><br>
                    {!! $res['d']['instruksianjuran'] !!}
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:2px">
                    <b>Pemberian Obat Selama Perawatan :</b><br>
                    {!! $res['d']['terapi'] !!}
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:2px">
                    <b>Instruksi Follow Up / Tindak Lanjut</b><br>
                    <b>a. Pemberian Obat Waktu Pulang :</b><br>
                    {!! $res['d']['terapipulang'] !!}
                    <br>
                    <b>b. Edukasi Pulang :</b><br>
                    {!! $res['d']['edukasi'] !!}
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:2px">
                    <b>Status / Kondisi Pasien Waktu Pulang :</b><br>
                    {!! $res['d']['ringkasanriwayatpenyakit'] !!}
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:2px">
                    <b>Keadaan Keluar :</b><br>
                    @if ($res['d']['rkeadaankeluar'] == 1)
                    <div style="padding:5px">
                       Perbaikan
                    </div> 
                    @elseif ($res['d']['rkeadaankeluar'] == 2)
                    Sembuh
                    @elseif ($res['d']['rkeadaankeluar'] == 3)
                    Pulang
                    @endif
                    
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:2px" >
                    <b>Cara Keluar :</b><br>
                    @if ($res['d']['rcarapulang'] == 1)
                        Atas Persetujuan Dokter
                    @elseif ($res['d']['rcarapulang'] == 2)
                    Rujuk,{!! $res['d']['rujuk'] !!}
                    @elseif ($res['d']['rcarapulang'] == 3)
                    Atas Permintaan Sendiri
                    @elseif ($res['d']['rcarapulang'] == 4)
                    Lain-lain,,{!! $res['d']['lainlain'] !!}
                    @endif
                    
                </td>
            </tr>
        </table>
        <table style="padding: 5px">
            <tr>
                <td>Saya telah menerima informasi tersebut dan menyetujui bahwa Ringkasan Pulang ini hanya digunakan untuk
                    kepentingan pengobatan, serta TIDAK DAPAT digunakan untuk kepentingan lainnya.</td>
            </tr>
        </table>
   

        <div class="footer2">
            <table width="100%">
                <tbody>
                    <tr>
                        <td width="33%" style="text-align: center"></td>
                        <td width="33%"></td>
                        <td width="33%">
                            <b>Yogyakarta, {{date('d-m-Y')}}</b>
                        </td>
                    </tr>
                    <tr>
                        <td width="33%" style="text-align: center"><b>Pasien / Wali Pasien
                        </b> </td>
                        <td width="33%"></td>
                        <td width="33%">
                            <b>Dokter Penanggung Jawab Pasien</b>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td height="40px"> </td>
                    </tr>
                    <tr>
                        <td style="text-align: center"> {!!$res['d']['pasien']!!}</td>
                        <td style="text-align: center">&nbsp;</td>
                        <td style="text-align: center">
                            {{-- <br>{!! $res['d'][0]->namadokter == null ? ($peg!=null?$peg->namalengkap:'-'): $res['d'][0]->namadokter !!} --}}
                            <br>{!! $res['d']['namadokter'] !!}
                        </td>
                    </tr>
                  
                </tbody>
            </table>
        </div>
    </section>
</body>
</html>