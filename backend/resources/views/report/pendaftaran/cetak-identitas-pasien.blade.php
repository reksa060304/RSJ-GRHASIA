<!DOCTYPE html>
<html>
<head>
    <title>Lembar Identitas Pasien - {{ $data->nocm }}</title>
    <style>
        @page {
            margin: 15px 35px 15px 35px;
            size: A4 portrait;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 9.5pt;
            color: #000000;
            line-height: 1.25;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0px;
        }
        .header-logo-container {
            text-align: center;
            vertical-align: middle;
            padding: 5px;
        }
        .header-logo-text {
            font-size: 7.5pt;
            font-weight: bold;
            line-height: 1.1;
            margin-top: 3px;
        }
        .header-text-container {
            text-align: center;
            vertical-align: middle;
            font-family: Arial;
        }
        .header-pemerintah {
            font-size: 10.5pt;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .header-dinas {
            font-size: 12.5pt;
            font-weight: bold;
            margin-top: 2px;
        }
        .header-rs {
            font-size: 11.5pt;
            font-weight: bold;
            margin-top: 2px;
        }
        .header-address {
            font-size: 8pt;
            line-height: 1.2;
            margin-top: 2px;
            color: #000000;
        }
        .double-divider {
            border-bottom: 5px solid #000000;
            margin-top: 4px;
            margin-bottom: 2px;
        }
        .doc-title-container {
            border-top: 3px double #000000;
            border-bottom: 3px double #000000;
            padding: 4px 0;
            text-align: center;
            margin-top: 5px;
            margin-bottom: 15px;
        }
        .doc-title {
            font-size: 11pt;
            font-weight: bold;
            letter-spacing: 1.5px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .details-table td {
            padding: 3.5px 2px;
            vertical-align: top;
        }
        .label-col {
            width: 32%;
        }
        .colon-col {
            width: 3%;
            text-align: center;
        }
        .value-col {
            width: 65%;
        }
        .photo-box-table {
            border: 1.5px solid #000000;
            width: 120px;
            height: 150px;
            text-align: center;
            margin-left: auto;
            border-collapse: collapse;
        }
        .photo-box-empty {
            border: 1.5px dashed #000000;
            width: 120px;
            border-collapse: collapse;
        }
        .photo-box-empty td {
            width: 120px;
            height: 150px;
            vertical-align: middle;
            text-align: center;
            font-size: 8pt;
            color: #555555;
            font-style: italic;
            padding: 5px;
        }
        .sub-details-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
        }
        .sub-details-table td {
            padding: 3px 2px;
            vertical-align: top;
        }
        .bottom-table {
            width: 100%;
            border-collapse: collapse;
            border: 1.5px solid #000000;
            margin-top: 15px;
            font-size: 9pt;
        }
        .bottom-table td {
            border: 1.2px solid #000000;
            padding: 5px 8px;
            vertical-align: top;
        }
        .checkbox-container {
            margin-bottom: 3px;
        }
        .checkbox-box {
            display: inline-block;
            width: 11px;
            height: 11px;
            border: 1.5px solid #000000;
            margin-right: 5px;
            vertical-align: middle;
        }
        .note {
            font-size: 7.5pt;
            font-style: italic;
            color: #333333;
        }
    </style>
</head>
<body>

    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td width="18%" class="header-logo-container">
                @if(stripos(\Request::url(), 'localhost') !== FALSE)
                    <img src="{{ public_path('img/logo_grhasia_new.png') }}" alt="" style="width: 75px;">
                @else
                    <img src="{{ public_path('service/img/logo_grhasia_new.png') }}" alt="" style="width: 75px;">
                @endif
                <div class="header-logo-text">
                    RS JIWA GRHASIA<br>
                    <span style="font-size: 5.5pt; font-weight: normal;">Daerah Istimewa Yogyakarta</span>
                </div>
            </td>
            <td width="82%" class="header-text-container">
                <div class="header-pemerintah">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</div>
                <div class="header-dinas">DINAS KESEHATAN</div>
                <div class="header-rs">RUMAH SAKIT JIWA GRHASIA</div>
                @if(stripos(\Request::url(), 'localhost') !== FALSE)
                    <img src="{{ public_path('img/Aksara Jawa_Surat.png') }}" alt="" style="width: 130px; margin: 2px 0;">
                @else
                    <img src="{{ public_path('service/img/Aksara Jawa_Surat.png') }}" alt="" style="width: 130px; margin: 2px 0;">
                @endif
                <div class="header-address">
                    Jalan Kaliurang KM.17, Duwetsari, Pakembinangun, Kec. Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta, 55582
                    <br>
                </div>
            </td>
        </tr>
    </table>

    <div class="double-divider"></div>

    <!-- Document Title -->
    <div class="doc-title-container">
        <div class="doc-title">DATA SOSIAL PASIEN</div>
    </div>

    <!-- Main Details Row with Photo Box -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td width="75%" style="vertical-align: top;">
                <table class="details-table">
                    <tr>
                        <td class="label-col">Nomor RM</td>
                        <td class="colon-col">:</td>
                        <td class="value-col"><strong>{{ $data->nocm }}</strong></td>
                    </tr>
                    <tr>
                        <td class="label-col">Nama Pasien</td>
                        <td class="colon-col">:</td>
                        <td class="value-col"><strong>{{ strtoupper($data->namapasien) }}</strong></td>
                    </tr>
                    <tr>
                        <td class="label-col">Jenis Kelamin</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ $data->jeniskelamin }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tempat Tgl Lahir</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ strtoupper($data->tempatlahir) }}, {{ $data->tgllahir ? date('d-m-Y', strtotime($data->tgllahir)) : '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Golongan Darah</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ $data->golongandarah }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Pendidikan</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ $data->pendidikan }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Status</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ $data->statusperkawinan }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Umur</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ $ageStr }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Agama</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ strtoupper($data->agama) }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Pekerjaan</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ strtoupper($data->pekerjaan) }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Cara Bayar</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ $data->carabayar ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Nmr Cara Bayar</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">
                            @if(isset($data->carabayar) && strpos(strtoupper($data->carabayar), 'BPJS') !== false)
                                {{ $data->nobpjs }}
                            @else
                                {{ $data->noasuransilain != '-' ? $data->noasuransilain : '' }}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="label-col">Nmr KTP</td>
                        <td class="colon-col">:</td>
                        <td class="value-col">{{ $data->noidentitas }}</td>
                    </tr>
                </table>
            </td>
            <td width="25%" style="vertical-align: top; text-align: right;">
                @if(!empty($fotoData))
                    <img src="{{ $fotoData }}" style="width: 120px; height: 150px; border: 1.5px dashed #000000;" />
                @else
                    <table class="photo-box-empty" style="margin-left: auto;">
                        <tr>
                            <td>(Foto<br>ditempel<br>disini)</td>
                        </tr>
                    </table>
                @endif
            </td>
        </tr>
    </table>

    <table class="details-table" style="margin-top: 3px;">
        <tr>
            <td class="label-col" style="width: 24%;"><strong>Alamat Pasien</strong></td>
            <td class="colon-col" style="width: 2.25%;">:</td>
            <td class="value-col" style="width: 73.75%;">{{ strtoupper($data->alamatlengkap) }}</td>
        </tr>
    </table>

    <hr style="border: 0.5px solid #000000; margin: 6px 0 4px 0;">

    <!-- Regional & Address Details -->
    <table class="sub-details-table">
        <tr>
            <td width="16%">Desa / Kelurahan</td>
            <td width="2%">:</td>
            <td width="38%">{{ strtoupper($data->namadesakelurahan ?? '-') }}</td>
            <td width="10%">Provinsi</td>
            <td width="2%">:</td>
            <td width="32%">{{ strtoupper($data->namapropinsi ?? '-') }}</td>
        </tr>
        <tr>
            <td>Kecamatan</td>
            <td>:</td>
            <td>{{ strtoupper($data->kecamatan ?? '-') }}</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>Kabupaten</td>
            <td>:</td>
            <td>{{ strtoupper($data->kotakabupaten ?? '-') }}</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <!-- Penanggung Jawab Section -->
    <div style="font-weight: bold; margin-top: 10px; font-size: 9.5pt;">Penanggung Jawab Pasien &nbsp;&nbsp;&nbsp;&nbsp;:</div>
    <hr style="border: 0.5px solid #000000; margin: 3px 0 6px 0;">

    <table class="sub-details-table">
        <tr>
            <td width="16%">Nama</td>
            <td width="2%">:</td>
            <td width="82%">{{ strtoupper($data->penanggungjawab ?? '-') }}</td>
        </tr>
        <tr>
            <td>Hubungan</td>
            <td>:</td>
            <td>{{ strtoupper($data->hubungankeluargapj ?? '-') }}</td>
        </tr>
        <tr>
            <td>Alamat</td>
            <td>:</td>
            <td>{{ strtoupper($data->alamatrmh ?? '-') }}</td>
        </tr>
        <tr>
            <td>Telepon</td>
            <td>:</td>
            <td>{{ $data->notelepon }}</td>
        </tr>
    </table>

    <!-- Assessment Grid Table -->
    <table class="bottom-table">
        <tr>
            <td style="width: 35%;">
                Jenis Kelamin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <br>
                <strong>{{ $data->jeniskelamin }}</strong> <br><br>
                <span class="note">(Diisi Petugas RM)</span>
            </td>
            <td style="width: 65%;"></td>
        </tr>
        <tr>
            <td>
                <div class="checkbox-container"><span class="checkbox-box"></span> Risiko Jatuh</div>
                <div class="checkbox-container"><span class="checkbox-box"></span> Risiko Bunuh Diri</div>
                <div class="checkbox-container"><span class="checkbox-box"></span> Risiko Perilaku Kekerasan</div>
                <br>
                <span class="note">(Diisi Perawat/ Dokter)</span>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                Alergi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <strong>TIDAK ADA</strong> <br><br>
                Jenis Obat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </td>
            <td></td>
        </tr>
        <tr>
            <td style="padding-bottom: 25px;">
                <br>
                <span class="note">(Diisi Perawat/ Dokter)</span>
            </td>
            <td></td>
        </tr>
    </table>

</body>
</html>
