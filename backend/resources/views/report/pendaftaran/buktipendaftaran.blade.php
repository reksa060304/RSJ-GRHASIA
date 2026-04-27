<html>

<head>
    <title>
        Report
    </title>
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
    @media print {
        @page {
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

    tr td {
        /*padding:2px 4px 2px 4px;*/
    }

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Tahoma, Geneva, sans-serif;
    }
</style>
{{----}}

<body style="background-color: #CCCCCC;margin: 0" onLoad="window.print()">
    <div align="left">
        <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="365" style="margin-bottom: 5cm;">
            <tbody>
                <tr>
                    <td style="padding: 20px 30px;text-align: left">
                        {{-- Header Section --}}
                        <font style="font-size: 11pt;font-weight: bold;" color="#000000" face="Tahoma">{{$dataReport['namaprofile']}}</font><br>
                        <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['alamat']}}</font><br>
                        <font style="font-size: 8pt;" color="#000000" face="Tahoma">Tlpn. {{$profile->notelp ?? '(0274) 895257'}} Fax. {{$profile->nofax ?? '(0274) 895142'}}</font>
                        <hr style="border-top: 1px solid #000; margin: 10px 0 8px 0;" />


                        {{-- Patient Information --}}
                        <table cellspacing="0" cellpadding="2" border="0" width="100%">
                            <tr>
                                <td width="35%">
                                    <font style="font-size: 12pt;" color="#000000" face="Tahoma">No. Antrian</font>
                                </td>
                                <td width="5%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 32pt; font-weight: bold;" color="#000000" face="Tahoma">{{$dataReport['noantrian']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Tgl. Cetak</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{date('d-m-Y H:i:s')}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" style="padding: 5px 0;">
                                    <hr style="border-top: 1px solid #000; margin: 0;" />
                                </td>
                            </tr>

            <tr>
                                <td width="35%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Tgl. Registrasi</font>
                                </td>
                                <td width="5%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['tglregistrasi']}}</font>
                                </td>
                            </tr>
                            <!-- <tr>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">No. Registrasi</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['noregistrasi']}}</font>
                                </td>
                            </tr> -->
                            <tr>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">No. RM</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 12pt; font-weight: bold;" color="#000000" face="Tahoma">{{$dataReport['norm']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top;">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Nama Pasien</font>
                                </td>
                                <td style="vertical-align: top;">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td style="vertical-align: top;word-wrap: break-word;white-space: normal;">
                                    <font style="font-size: 8pt; font-weight: bold;" color="#000000" face="Tahoma">{{$dataReport['namapasien']}} / {{$dataReport['jeniskelamin']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top;">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Alamat</font>
                                </td>
                                <td style="vertical-align: top;">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td style="vertical-align: top;word-wrap: break-word;white-space: normal;">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['alamatlengkap']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Jenis Pasien</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['kelompokpasien']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Status</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['statuspasien']}}</font>
                                </td>
                            </tr>
                        </table>
                        
                        <hr style="border-top: 1px solid #000; margin: 8px 0;" />

                        {{-- Ruangan/Poliklinik Section --}}
                        <div style="text-align: center;padding: 8px 0;">
                            <font style="font-size: 16pt;font-weight: bold;" color="#000000" face="Tahoma">{{$dataReport['ruangan']}}</font>
                        </div>
                        <hr style="border-top: 1px solid #000; margin: 8px 0;" />

                        {{-- Additional Info --}}
                        <table cellspacing="0" cellpadding="2" border="0" width="100%">
                            <!-- @if($dataReport['tanggalreservasi'] != '')
                            <tr>
                                <td width="35%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Tgl. Reservasi</font>
                                </td>
                                <td width="5%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['tanggalreservasi']}}</font>
                                </td>
                            </tr>
                            @endif -->
                            <tr>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Pemberi Layanan</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">:</font>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;font-weight: bold;" color="#000000" face="Tahoma">{{$dataReport['namadokter']}}</font>
                                </td>
                            </tr>
                        </table>

                        <hr style="border-top: 1px solid #000; margin: 8px 0;" />

                        {{-- QR Code Section --}}
                        <div style="text-align: center;padding: 15px 0 0 0;">
                            <font style="font-size: 9pt; font-weight: bold; font-style: italic;" color="#000000" face="Tahoma">Scan barcode untuk antrian farmasi</font>
                        </div>
                        <div style="text-align: center;padding: 5px 0 12px 0;">
                            {!! QrCode::size(150)->margin(2)->generate($dataReport['noregistrasi']) !!}
                        </div>

                        {{-- Online Patient Section --}}
                        @if($dataReport['tanggalreservasi'] != '')
                        <hr style="border-top: 1px solid #000; margin: 8px 0;" />
                        <div style="text-align: center;padding: 5px 0;">
                            <font style="font-size: 9pt;font-style: italic;" color="#000000" face="Tahoma">{{$dataReport['statusonline']}}</font>
                        </div>
                        @endif

                        <hr style="border-top: 1px solid #000; margin: 8px 0;" />

                        {{-- Footer Message --}}
                        @if($dataReport['status'] != '')
                        <div style="text-align: center;padding: 5px 0;">
                            <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['status']}}</font>
                        </div>

                        <hr style="border-top: 1px solid #000; margin: 8px 0;" />
                        @else
                        <div style="text-align: center;padding: 5px 0;">
                            <font style="font-size: 8pt;" color="#000000" face="Tahoma">Kartu ini adalah bukti anda mendaftar hari ini</font>
                        </div>

                        <hr style="border-top: 1px solid #000; margin: 8px 0;" />
                        @endif

                        {{-- Memo Section --}}
                        <font style="font-size: 8pt;" color="#000000" face="Tahoma">Memo :</font>
                        <table cellspacing="0" cellpadding="3" border="0" width="100%" style="margin-top: 5px;">
                            <tr>
                                <td width="20px" style="vertical-align: middle;">
                                    <span style="font-size:13pt;color:#000000;line-height:1;">&#9744;</span>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Injeksi</font>
                                </td>
                            </tr>
                            <tr>
                                <td width="20px" style="vertical-align: middle;">
                                    <span style="font-size:13pt;color:#000000;line-height:1;">&#9744;</span>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Konsultasi ke klinik . . . . . . . . . . . . . .</font>
                                </td>
                            </tr>
                             <tr>
                                <td width="20px" style="vertical-align: middle;">
                                    <span style="font-size:13pt;color:#000000;line-height:1;">&#9744;</span>
                                </td>
                                <td>
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Lain-Lain . . . . . . . . . . . . . . . . . . . . .</font>
                                </td>
                            </tr>
                        </table>
                        <div style="text-align: center;padding-top: 15px;">
                            <font style="font-size: 10pt;font-weight: bold;" color="#000000" face="Tahoma">****</font>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>