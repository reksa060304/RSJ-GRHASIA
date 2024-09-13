<!DOCTYPE html>
<html>
    <head>
        <title>Surat Eligibilitas Peserta</title>
    </head>
    <style>
        @page { margin: 0px; }
        body { 
            margin: 0px;
            font-family: Tahoma, "Trebuchet MS", sans-serif;
        }
    </style>
    <body>
        <table width="100%">
            <tr>
                <td style="padding:0px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td width="35%">
                                <p align="left">
                                    <img src="{{ public_path('img/logo_bpjs.png') }}" style="width: 240px" border="0"/>
                                </p>
                            </td>
                            <td width="65%">
                                <p align="left">
                                    <font style="font-size: 14pt;" color="#000000">SURAT ELEGIBILITAS PESERTA</font><br>
                                    <font style="font-size: 12pt;" color="#000000">{{ $dataReport['ppkPelayanan'] }}</font><br>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:0px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">NO. SEP</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;">
                                <font style="font-size: 10pt;" color="#000000">{{ $dataReport['nosep'] }}
                                    @if(date_create($dataReport['tanggalsep']) < date_create($dataReport['tglcreate']))
                                        {{ " (BACKDATE)" }}
                                    @endif
                                </font>
                            </td>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Tgl. SEP</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ date_format(date_create($dataReport['tanggalsep']), 'd/m/Y') }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Peserta</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['jenispeserta'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">No. Kartu</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['nokepesertaan'] }} &nbsp;&nbsp;&nbsp; ( MR. {{ $dataReport['norm'] }} )</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">COB</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['cob'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Nama Peserta</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['namapeserta'] }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Jns. Rawat</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['jenisrawat'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Tgl. Lahir</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ date_format(date_create($dataReport['tgllahir']), 'd/m/Y') }} &nbsp;&nbsp;&nbsp; Kelamin : {{ $dataReport['jeniskelamin'] }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Jns. Kunjungan</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['kunjungan'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">No. Telepon</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['notelpmobile'] }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['procedures'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Sub/Spesialis</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['namaruangan'] }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Poli Perujuk</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['polirujukannama'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Dokter</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['namadjpjpmelayanni'] }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Kls. Hak</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['haknamakelas'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Faskes Perujuk</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['nmprovider'] }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Kls. Rawat</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['namakelas'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Diagnosa Awal</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['namadiagnosa'] }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Penjamin</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['penjaminlakalantas'] }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Catatan</font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">:</font></td>
                            <td height="5" width="38%" style="vertical-align:top;padding-right:10px;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['catatan'] }}</font></td>
                            {{-- batas --}}
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                            <td height="5" width="2%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                            <td height="5" width="28%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:0px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td height="5" width="60%" style="vertical-align:top" align="left">
                                <font style="font-size: 8pt;font-style:italic;" color="#000000">*Saya Menyetujui BPJS Kesehatan menggunakan informasi Medis Pasien jika diperlukan.</font><br/>
                                <font style="font-size: 8pt;font-style:italic;" color="#000000">*SEP bukan sebagai bukti penjaminan peserta</font><br/>
                                @if($dataReport['objectdepartemenfk'] == 16)
                                <font style="font-size: 8pt;font-style:italic;" color="#000000">** Dengan diterbitkan SEP ini, Peserta rawat inap telah mendapatkan informasi dan <br> menampati kelas rawat sesuai hak akses kelasnya (terkecuali kelas penuh atau naik kelas <br> sesuai aturan yang berlaku)</font><br/>
                                @endif
                                <font style="font-size: 8pt;font-style:italic;" color="#000000">dengan terlebih dahulu.</font><br/>
                                <font style="font-size: 8pt;font-style:italic;" color="#000000">Cetakan Ke 1 {{ $dataReport['tanggal'] }}</font><br/>
                            </td>
                            <td height="5" width="40%" style="vertical-align:top" align="center">
                                <font style="font-size: 10pt;" color="#000000">Pasien/Keluarga Pasien</font><br/>
                                {{-- <font style="font-size: 10pt;" color="#000000">_________________</font><br/> --}}
                                <img src="data:image/png;base64, {!! $qrcode !!}"><br/>
                                <font style="font-size: 10pt;" color="#000000">{{ ucwords(strtolower($dataReport['namapeserta'])) }}</font>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>