<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Gaji Inpassing 2024 - {{ $data->nama }}</title>
    
    <style>
        @font-face {
            font-family: 'BookmanOldStyle';
            src: url('{{ asset('fonts/BookmanOldStyle.TTF') }}')
        }

        @page {
            size: 21.5cm 33cm;
            margin: 1.5cm 2cm 4cm 1.9cm 
        }

        @page :first {
            size: 21.5cm 33cm;
            margin: 1cm 2cm 4cm 1.9cm
        }
        /* body{
            width: 21.5cm;
            height: 33cm;
        } */
        p {
            line-height: 1.5;
            margin: 0;
        }
        .newpage { margin-top: 1.5cm; page-break-before: always; }
        body {
            font-family: 'BookmanOldStyle';
            margin: 0;
        }
    </style>
</head>

<body>
    {{-- Header --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%" >
        <tbody>
            <tr>
                <td width="10%" style="text-align:left;">
                    <img src="data:image/jpeg;base64,{{$profile[0]->logopemerintahan}}" alt=""
                        style="height:120px; width:97px;">
                </td>
                <td style="text-align: center; font-family: Arial">
                    <p style="margin:0; font-size:12pt;">{{strtoupper($profile[0]->baris1)}}</p>
                    
                    <h1 style="font-size:16pt; font-weight:bold; ">SEKRETARIAT DAERAH</h1>
                    
                    <p style="font-size: 11pt; margin: 0;">Kepatihan Danurejan Yogyakarta Telepon (0274)56281 Faksimile (0274) 555459</p>
                    <p style="font-size: 11pt; margin: 0;">Website: jdih.jogjaprov.go.id Email: birohukum@jogjaprov.go.id Kode pos 55213</p>
                </td>
            </tr>
        </tbody>
    </table>

    <hr style="border:1px solid #000;margin-bottom:0px">
    
    {{-- Petikan --}}
    <table style="text-align: center;" width="100%">
        <tr>
            <td>
                <p style="padding-top:6pt; padding-bottom:6pt;">PETIKAN</p>
            </td>
        </tr>
        <tr>
            <td>
                <p style="padding-bottom:6pt;">KEPUTUSAN SEKRETARIS DAERAH DAERAH ISTIMEWA YOGYAKARTA</p>
            </td>
        </tr>
        <tr>
            <td>
                <p style="padding-bottom:6pt;">NOMOR: {{ $data->nomorsk }}</p>
            </td>
        </tr>
        <tr>
            <td>
                <p style="padding-bottom:6pt;">TENTANG</p>
            </td>
        </tr>
        <tr>
            <td>
                <p>PENYESUAIAN GAJI POKOK</p>
                <p>PEGAWAI NEGERI SIPIL DAN PEGAWAI PEMERINTAH DENGAN PERJANJIAN</p>
                <p>KERJA DI LINGKUNGAN BADAN PENGELOLA KEUANGAN DAN ASET DIY</p>
                <p>TAHUN 2024</p>
            </td>
        </tr>
        <tr>
            <td>
                <p style="padding-top:12pt; padding-bottom:18pt;">
                    SEKRETARIS DAERAH DAERAH ISTIMEWA YOGYAKARTA,
                </p>
            </td>
        </tr>
    </table>

    {{-- Menimbang --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="width: 17%;">
                <p style="padding-bottom:12pt">Menimbang</p>
            </td>
            <td>
                <p style="padding-bottom:12pt">dan Seterusnya</p>
            </td>
        </tr>
        <tr>
            <td style="width: 17%;">
                <p style="padding-bottom:12pt">Mengingat</p>
            </td>
            <td>
                <p style="padding-bottom:12pt">dan Seterusnya</p>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center;">
                <p style="padding-top:6pt; padding-bottom:6pt">MEMUTUSKAN</p>
            </td>
        </tr>
        <tr>
            <td style="width: 17%; vertical-align: top;">
                <p style="padding-bottom:6pt">Menetapkan</p>
            </td>
            <td style="text-align:justify;">
                <p style="padding-bottom:6pt">
                    KEPUTUSAN SEKRETARIS DAERAH TENTANG PENYESUAIAN GAJI
                    POKOK PEGAWAI NEGERI SIPIL DAN PEGAWAI PEMERINTAH
                    DENGAN PERJANJIAN KERJA DI LINGKUNGAN RUMAH SAKIT JIWA GRHASIA TAHUN 2024
                </p> 
            </td>
        </tr>
        <tr>
            <td style="width: 17%; vertical-align: top;">
                <p style="margin: 0;">KESATU</p>
            </td>
            <td>
                <p style="margin:0">
                    Terhitung mulai tanggal 1 Januari 2024 menyesuaikan gaji pokok 
                    @foreach ($status as $item)
                        @if ($item !== $data->reportdisplay)
                            <span style="text-decoration: line-through;">
                                {{ $item }}
                            </span>
                        @else
                            <span>
                                <span> / </span>
                                <span>{{ $item }}</span>
                                <span> / </span>
                            </span>
                        @endif
                    @endforeach
                    sebagai berikut:
                </p>
                <div>
                    
                </div>
            </td>
        </tr>
    </table>

    {{-- Data pegawai --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="width: 17%; vertical-align:top; padding-bottom:12pt"></td>
            <td>
                <div style="padding-top: 1em; padding-bottom:12pt;">
                    <table style="border: 1px solid black; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">1</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Nama</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->nama }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">2</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">NIP</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->nip }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">3</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Tempat, Tanggal Lahir</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->ttl }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">4</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Pangkat, Golongan Ruang</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->pangkatgolongan }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">5</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Masa Kerja Golongan</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->mkglama }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">6</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Gaji Pokok Lama</td>
                            <td style="padding: 0.5em; border: 1px solid black;">
                                @if(isset($data->gapoklama))
                                    Rp. {{  number_format($data->gapoklama,2,'.',',') }}
                                @endif    
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">7</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Gaji Pokok Baru</td>
                            <td style="padding: 0.5em; border: 1px solid black;">
                                @if(isset($data->gapokbaru))
                                    Rp. {{  number_format($data->gapokbaru,2,'.',',') }}
                                @endif
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">8</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Masa Kerja Golongan untuk kenaikan gaji berkala</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->mkgbaru }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">9</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Jabatan</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->namajabatan }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">10</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Unit Kerja</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->unitkerja }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 0.5em; width: 5%; border: 1px solid black;">11</td>
                            <td style="padding: 0.5em; width: 33%; border: 1px solid black;">Keterangan</td>
                            <td style="padding: 0.5em; border: 1px solid black;">{{ $data->keterangan }}</td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>

    {{-- Kedua --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="width: 17%; vertical-align: top;">
                <p style="padding-bottom:6pt">Kedua</p>
            </td>
            <td>
                <p style="padding-bottom:6pt">Keputusan ini mulai berlaku pada tanggal ditetapkan.</p>
            </td>
        </tr>
    </table>
    
    {{-- Penetapan --}}
    <table style="padding-top:1em; padding-right: 1cm;" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="width: 57%"></td>
            <td style="text-align: left;">
                <p style="padding-bottom:6pt">
                    Ditetapkan di Yogyakarta
                </p>
            </td>
        </tr>
        <tr>
            <td style="width: 57%"></td>
            <td style="text-align: left;">
                <p style="padding-bottom:6pt">
                    Pada tanggal 14 Maret 2024
                </p>
            </td>
        </tr>
    </table>

    {{-- Tanda tangan --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="text-align: center;">
                <p style="margin:0;">Petikan sesuai dengan aslinya</p>
                <p style="margin:0;">a.n. Sekretaris Daerah</p>
                <p style="margin:0;">Kepala Biro Hukum</p>
                <p style="margin:0;">Sekretariat Daerah</p>
                <p style="margin:0;">Daerah Istimewa Yogyakarta,</p>
            </td>
            <td style="text-align: center;">
                <p>SEKRETARIS DAERAH</p>
                <p>DAERAH ISTIMEWA YOGYAKARTA,</p>
            </td>
        </tr>
        <tr style="text-align: center;">
            <td style="padding: 1cm;"><p></p></td>
            <td><p>TTD</p></td>
        </tr>
        <tr style="text-align: center;">
            <td>HARY SETIAWAN</td>
            <td>BENY SUHARSONO</td>
        </tr>
    </table>

    {{-- Footer --}}
    <div>
        <table style="margin-top: 1cm;">
            <tr>
                <td>Salinan Keputusan ini disampaikan kepada Yth:</td>
            </tr>
        </table>
        <table>
            
            <tr>
                <td>1.</td>
                <td>Deputi Bidang Informasi Kepegawaian Badan Kepegawaian Negara RI di Jakarta;</td>
            </tr>
            <tr>
                <td>2.</td>
                <td>Kepala Kantor Regional I BKN Yogyakarta;</td>
            </tr>
            <tr>
                <td>3.</td>
                <td>Kepala Badan Pengelola Keuangan dan Aset DIY;</td>
            </tr>
            <tr>
                <td>4.</td>
                <td>Kepala Badan Kepegawaian Daerah DIY;</td>
            </tr>
            <tr>
                <td>5.</td>
                <td>Pembuat Daftar Gaji;</td>
            </tr>
            <tr>
                <td>6.</td>
                <td>Wiyos Santoso, S.E., M.Acc.;</td>
            </tr>
            <tr>
                <td></td>
                <td style="text-decoration: underline">untuk diketahui dan/atau dipergunakan sebagaimana mestinya.</td>
            </tr>
        </table>
    </div>

    <script>
        window.print()
    </script>
</body>

</html>
