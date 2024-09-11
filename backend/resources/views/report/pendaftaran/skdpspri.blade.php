<!DOCTYPE html>
<html>
    <head>
        <title>Surat Rencana Kontrol</title>
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
                <td style="padding:10px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td width="35%">
                                <p align="left">
                                    <img src="{{ public_path('img/logo_bpjs.png') }}" style="width: 240px" border="0"/>
                                </p>
                            </td>
                            <td width="30%">
                                <p align="left">
                                    @if($dataReport['dataSurat']->jnsKontrol == "1")
                                        <font style="font-size: 12pt;" color="#000000">SURAT PERINTAH RAWAT INAP</font><br>
                                    @else
                                        <font style="font-size: 12pt;" color="#000000">SURAT RENCANA KONTROL</font><br>
                                    @endif
                                    <font style="font-size: 12pt;" color="#000000">{{ $dataReport['ppkPelayanan'] }}</font><br>
                                </p>
                            </td>
                            <td width="30%" style="vertical-align:top;">
                                <p align="right">
                                    <font style="font-size: 12pt;" color="#000000">No. {{ $dataReport['dataSurat']->noSuratKontrol }}</font><br>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:10px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Kepada Yth</font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['dataSurat']->namaDokter }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Sp./Sub. {{  str_replace("Poliklinik", "", $dataReport['dataSurat']->namaPoliTujuan) }}</font></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:0px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td height="5" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Mohon Pemeriksaan dan Penanganan Lebih Lanjut : </font></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:0px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">No.Kartu</font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">: {{ $dataReport['dataSurat']->noKartu }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Nama Peserta</font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">: {{ $dataReport['dataSurat']->nama }} ({{ $dataReport['data']->jeniskelamin }})</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Tgl.Lahir</font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">: {{ date_format(date_create($dataReport['data']->tgllahir), 'd/m/Y') }}</font></td>
                        </tr>
                        @if($dataReport['dataSurat']->jnsKontrol == "1")
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Diagnosa Awal</font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">: {{ $dataReport['data']->namadiagnosa }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Tgl Entri</font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">: {{ $dataReport['dataSurat']->tglTerbitKontrol }}</font></td>
                        </tr>
                        @else
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Diagnosa</font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">: {{ $dataReport['data']->namadiagnosa }}</font></td>
                        </tr>
                        <tr>
                            <td height="5" width="15%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Rencana Kontrol</font></td>
                            <td height="5" width="85%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">: {{ $dataReport['dataSurat']->tglRencanaKontrol }}</font></td>
                        </tr>
                        @endif
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:0px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td height="5" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Demikian atas bantuannya, diucapkan banyak terimakasih. </font></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding:00px 30px 0px 30px;">
                    <table width="100%">
                        <tr>
                            <td height="5" width="60%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000"></font></td>
                            <td height="5" width="40%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">Mengetahui,</font></td>
                        </tr>
                        <tr>
                            <td height="20" width="60%" style="vertical-align:top;"></td>
                            <td height="20" width="40%" style="vertical-align:top;"></td>
                        </tr>
                        <tr>
                            <td height="5" width="60%" style="vertical-align:top;"><font style="font-size: 10pt;font-style:italic" color="#000000">Tgl. Cetak {{ $dataReport['tglAyeuna'] }}</font></td>
                            <td height="5" width="40%" style="vertical-align:top;"><font style="font-size: 10pt;" color="#000000">{{ $dataReport['dataSurat']->namaDokter }}</font></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>