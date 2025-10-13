<html>
<head>
    <title>
        Cetak Bukti Usulan Barang
    </title>
@if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link rel="stylesheet" href="{{ asset('css/paper.css') }} ">
    <link rel="stylesheet" href="{{ asset('css/table-v2.css') }}">
    <link rel="stylesheet" href="{{ asset('css/tabel.css') }}">
    <link  rel="stylesheet" href="{{ asset('css/style.css') }}">
@else
    <link rel="stylesheet" href="{{ asset('service/css/paper.css') }} ">
    <link rel="stylesheet" href="{{ asset('service/css/table-v2.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/tabel.css') }}">
    <link  rel="stylesheet" href="{{ asset('service/css/style.css') }}">
@endif
</head>
<style type="text/css" media="print">
    @media print
    {
        @page
        {
            size: auto;
            margin: 0;
            /* size: portrait; */
        }
        footer {
            display: none
        }
        header {
            display: none
        }
        body {
            -webkit-print-color-adjust: exact !important;
        }
    }
</style>
<style>
    tr td {
        padding:2px 4px 2px 4px;
    }
    .borderss{
        border-bottom: 1px solid black;
    }
    .baris1 {
       border: 2px solid #000000;
    }
    .baris2 {
       border: 1px solid #000000;
    }
    .garishalus{
       border:0.01em solid #9a9a9a;
    }
    .garishalus tr td {
       border:0.01em solid #9a9a9a;
       /* border: thin solid #9a9a9a; */
    }
    body{
        font-family: Tahoma, Geneva, sans-serif;
    }
 @page { size: A4 } .garis6 td{padding:3px !important;}
</style>
<body style="background-color: #CCCCCC;margin: 0" onLoad="window.print()">
<div align="center">
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="padding:25px">
        <tbody>
            <tr>
                <td>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td rowspan="5">
                                <p align="center">
                                    @if(stripos(\Request::url(), 'localhost') !== FALSE)
                                        <img src="{{ asset('img/logo_rs.png') }}" width="80px" border="0">
                                    @else
                                        <img src="{{ asset('service/img/logo_rs.png') }}" width="80px" border="0">
                                    @endif
                                </p>
                            </td>
                            <td align="center">
                            </td>
                            <td rowspan="5">
                                <div style="width: 80px;">
                            </td>
                        </tr>
                        <tr>
                            <td align="left">
                                <font style="text-transform: capitalize;font-size: 8pt;font-weight: 600;letter-spacing: 1px;" color="#000000" >
                                    {!! $profile->namalengkap !!}                                    
                                </font>
                            </td>
                        </tr>
                        <tr>
                            <td align="left">
                                <font style="font-size: 6pt;" color="#000000" >
                                    {!! $profile->alamatlengkap  !!}                                   
                                    <!-- {{ $profile->fixedphone . "/" . $profile->faksimile }} -->
                                </font>
                            </td>
                        </tr>
                    </table>
                    <!-- <hr class="baris1"> -->
                    <hr class="baris2">
                </td>
            </tr>
            
            <tr>
                <td>
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center" height="20px">
                                <font style="font-size: 7pt;font-weight: bold" color="#000000" >Surat Pesanan</font>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td width="13%"><font style="font-size: 6pt;" color="#000000">No Usulan</font></td>
                            <td width="45%"><font style="font-size: 6pt;" color="#000000">: {{ $dataReport['datas']->noorder }}</font></td>
                            <td width="13%"><font style="font-size: 6pt;" color="#000000">Tgl. Usulan</font></td>
                            <td width="35%"><font style="font-size: 6pt;" color="#000000">: {{ $dataReport['datas']->tglorder }}</font></td>
                        </tr>
                        <tr>
                            <td width="13%"><font style="font-size: 6pt;" color="#000000">Koordinator Barang</font></td>
                            <td width="45%"><font style="font-size: 6pt;" color="#000000">: {{ $dataReport['datas']->keteranganlainnya }}</font></td>     
                            <td width="13%"><font style="font-size: 6pt;" color="#000000">Nama Supplier</font></td>
                            <td width="45%"><font style="font-size: 6pt;" color="#000000">: {{ $dataReport['datas']->namarekanansales }}</font></td>   
                        </tr> 
                        <tr>
                            <td width="13%"><font style="font-size: 6pt;" color="#000000">Jenis Usulan</font></td>
                            <td width="35%"><font style="font-size: 6pt;" color="#000000">: {{ $dataReport['datas']->kelompokproduk }}</font></td>
                            <td width="13%"><font style="font-size: 6pt;" color="#000000">Tgl Dibututhkan</font></td>
                            <td width="45%"><font style="font-size: 6pt;" color="#000000">: {{ $dataReport['datas']->tglkebutuhan }}</font></td>
                                                           
                        </tr>
                        <tr>
                            <td width="13%"><font style="font-size: 6pt;" color="#000000">Keterangan</font></td>
                            <td width="45%"><font style="font-size: 6pt;" color="#000000">: {{ $dataReport['datas']->keteranganorder }}</font></td>
                            <td width="13%"><font style="font-size: 6pt;" color="#000000"></font></td>
                            <td width="35%"><font style="font-size: 6pt;" color="#000000"></font></td>                             
                        </tr>                          
                    </table>
                </td>
            </tr>  
            <tr>
                <td style="padding-top:20px">
                    <table width="100%" cellspacing="0" cellpadding="0" border="1" align="center" bgcolor="#FFFFFF">
                        <tr class="garisatasbawah">
                            <td><font style="font-size: 6pt;" color="#000000">No</font></td>
                            <td><font style="font-size: 6pt;" color="#000000">Kd Barang</font></td>
                            <td><font style="font-size: 6pt;" color="#000000">Nama Barang / Spesifikasi</font></td>
                            <td><font style="font-size: 6pt;" color="#000000">Satuan</font></td>
                            <td><font style="font-size: 6pt;" color="#000000">Qty</font></td>
                            <td><font style="font-size: 6pt;" color="#000000">Harga Satuan</font></td>
                            <td><font style="font-size: 6pt;" color="#000000">Diskon %</font></td>
                            <td><font style="font-size: 6pt;" color="#000000">PPN</font></td> 
                            <td><font style="font-size: 6pt;" color="#000000">Total</font></td>                      
                        </tr>
                        @php 
                            $nomor = 1;                            
                            $total = 0;
                            $totalsubtotal = 0;
                            $totalppn = 0;
                            $totaldiskon = 0;
                            $subtotal = 0;
                            $subppn = 0;
                        @endphp
                        @foreach($dataReport['detail'] as $item)
                            @php                                
                                $totalsubtotal = $totalsubtotal + $item->subtotal;
                                $totalppn = $totalppn + ($item->qtyproduk*$item->hargappn);
                                $subppn = $subppn + $item->hargappn;
                                $totaldiskon = $totaldiskon + ($item->qtyproduk*$item->hargadiscount);
                                $total = $total + $item->total;
                                $subtotal = $total + $subppn;
                            @endphp
                            <tr>
                                <td><font style="font-size: 6pt;" color="#000000">{{ $nomor }}</font></td>   
                                <td><font style="font-size: 6pt;" color="#000000">{{ $item->kdproduk }}</font></td>
                                <td><font style="font-size: 6pt;" color="#000000">{{ $item->namaproduk }}</font></td>
                                <td><font style="font-size: 6pt;" color="#000000">{{ $item->satuanstandar }}</font></td>
                                <td><font style="font-size: 6pt;" color="#000000">{{ number_format($item->qtyproduk, 2, '.', ',') }}</font></td>
                                <td style="text-align: end"><font style="font-size: 6pt;" color="#000000">{{ number_format($item->hargasatuan, 2, '.', ',') }}</font></td> 
                                {{-- <td><font style="font-size: 6pt;" color="#000000">{{ number_format($item->persendiskon, 2, '.', ',') }}</font></td>  --}}
                                <td><font style="font-size: 6pt;" color="#000000">{{ $item->persendiskon }} %</font></td> 
                                 <td style="text-align: end"><font style="font-size: 6pt;" color="#000000">{{ number_format($item->hargappn, 2, '.', ',') }}</font></td>
                                <td style="text-align: end"><font style="font-size: 6pt;" color="#000000">{{ number_format($item->total, 2, '.', ',') }}</font></td>  
                            </tr>
                            {{-- <tr>
                                <td align="right" colspan="7">
                                    <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                        <b>Total Harga</b>
                                    </font>
                                </td>
                                <td align="right">
                                    <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                        {{ number_format($totalsubtotal, 2, '.', ',') }}
                                    </font>
                                </td>
                            </tr> --}}
                           <!--  <tr>
                                <td align="right" colspan="9">
                                    <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                        <b>Total PPN</b>
                                    </font>
                                </td>
                                <td align="right">
                                    <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                        {{ number_format($totalppn, 2, '.', ',') }}
                                    </font>
                                </td>
                            </tr> -->
                            {{-- <tr>
                                <td align="right" colspan="7">
                                    <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                        <b>Total Diskon</b>
                                    </font>
                                </td>
                                <td align="right">
                                    <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                        {{ number_format($totaldiskon, 2, '.', ',') }}
                                    </font>
                                </td>
                            </tr>
                            <tr>
                                <td align="right" colspan="7">
                                    <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                        <b>Total</b>
                                    </font>
                                </td>
                                <td align="right">
                                    <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                        {{ number_format($total, 2, '.', ',') }}
                                    </font>
                                </td>
                            </tr> --}}
                            @php
                                $nomor = $nomor + 1;
                            @endphp
                        @endforeach  
                        <tr>
                            <td align="right" colspan="8">
                                <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                    <b>Sub</b>
                                </font>
                            </td>
                            <td align="right">
                                <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                    {{ number_format($total, 2, '.', ',') }}
                                </font>
                            </td>
                        </tr>
                        <tr>
                            <td align="right" colspan="8">
                                <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                    <b>PPN</b>
                                </font>
                            </td>
                            <td align="right">
                                <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                    {{ number_format($subppn, 2, '.', ',') }}
                                </font>
                            </td>
                        </tr>                      
                        <tr>
                            <td align="right" colspan="8">
                                <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                    <b>Total</b>
                                </font>
                            </td>
                            <td align="right">
                                <font style="font-size: 6pt;font-weight:bold;" color="#000000" >
                                    {{ number_format($subtotal, 2, '.', ',') }}
                                </font>
                            </td>
                        </tr>                      
                    </table>
                </td>       
            </tr>                             
            <tr>
                <td style="padding-top:20px">
                    <table width="100%" style="border: 0" cellspacing="0" cellpadding="0">
                        <tr style="height: 0px;vertical-align: top;">
                            <td width="70%" style="text-align:left;">
                                <font style="font-size: 6pt;" color="#000000">
                                    {!! $profile->namakota !!}, &nbsp;&nbsp;{{ $dataReport['tanggal'] }}<br />
                                    DIBUAT
                                </font>
                            </td>
                            <td width="30%" style="text-align:left;">
                                <font style="font-size: 6pt;" color="#000000">
                                    MENGETAHUI <br />
                                    
                                </font>
                            </td>                          
                        </tr> 
                        <tr style="height: 50px;vertical-align: top;">
                            
                            <td width="0%" style="text-align:left;">
                               
                            </td>
                            {{-- idpegawai apt. Afrianty Ayu Pratiwi, s.si --}}
                           
                            
                           
                        </tr>                                             
                        <tr style="vertical-align: top;">
                            <td width="33%" style="text-align:left;">
                                <font style="font-size: 6pt;" color="#000000">
                                    {{ $dataReport['datas']->penanggungjawab }}<br />
                                    NIP : {{ $dataReport['datas']->nippns }}
                                </font>
                            </td>
                            <td width="33%" style="text-align:left;">
                                <font style="font-size: 6pt;" color="#000000">
                                    {{ $dataReport['datas']->namalengkap }}<br />
                                    NIP : {{ $dataReport['datas']->nippetugas }}
                                </font>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" style="border: 0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td width="100%" style="text-align:left;">
                                <font style="font-size: 5pt;" color="#000000">
                                    Syarat dan Ketentuan :
                                </font>
                                <br>
                                <font style="font-size: 5pt" color="#000000">
                                	1. Pengiriman barang diterima paling lambat 3 hari setelah surat pesanan diterima dengan ketentuan:
                                </font>
                                <br>
                                <font style="font-size: 5pt" color="#000000">
                                    &nbsp;&nbsp;&nbsp; - Barang dalam kondisi baik dan legal secara hukum serta melampirkan copy faktur / invoice pada saat pengiriman barang <br>
                                    &nbsp;&nbsp;&nbsp; - Masa expired barang minimal 2 tahun sejak dan tanggal penerimaan
                                </font>
                                <br>
                                <font style="font-size: 5pt" color="#000000">
                                    2. Pembayaran dilakukan setiap Tanggal 10 dan 20 di bulan berikutnya. Jika tanggal tersebut jatuh pada hari libur, maka dilaksanakan pada 1(satu) hari kerja berikutnya
                                </font>
                                <br>
                                <font style="font-size: 5pt" color="#000000">
                                    3. Tukar Faktur dilakukan setiap hari selasa dan kami pukul 09.00 s/d 12.00 dan 14.00 s/d 16.00 WIB Dengan Melampirkan :
                                </font>
                                <br>
                                <font style="font-size: 5pt" color="#000000">
                                    &nbsp;&nbsp;&nbsp;- Bukti Surat Pesanan<br>
                                    &nbsp;&nbsp;&nbsp;- Copy PKS (Jika ada)<br>
                                    &nbsp;&nbsp;&nbsp;- Faktur / Invoice asli dan faktur pajak 2 ply<br>
                                    &nbsp;&nbsp;&nbsp;- Dan nota retur bila ada
                                </font>
                            </td>                                                    
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</body>