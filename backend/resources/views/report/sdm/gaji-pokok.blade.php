<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Report Cetak KGB</title>
    
</head>

<body style="font-family:Arial;height: auto">
    <section style="font-family:Arial;">
        {{-- Header --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%" >
            <tbody>
                <tr>
                    <td width="10%" style="padding: 5px">
                        <img src="data:image/jpeg;base64,{{$profile[0]->logopemerintahan}}" alt=""
                            style="width: 95px; margin-bottom:35px">

                    </td>
                    <td style="text-align: center; font-family: Arial">
                        <p style="font-size:12pt;">{{strtoupper($profile[0]->baris1)}}</p>
                        
                        <h1 style="font-size:14pt; font-weight:bold; ">SEKERTARIAT DAERAH</h1>
                        
                        <p style="margin: 0;">Kepatihan Danurejan Yogyakarta Telepon (0274)56281 Faksimile (0274) 555459</p>
                        <p style="margin: 0;">Website: jdih.jogjaprov.go.id Email: birohukum@jogjaprov.go.id Kode pos 55213</p>
                    </td>
                </tr>
            </tbody>
        </table>

        <hr style="border:1px solid #000;margin-bottom:0px">

        {{-- Petikan --}}
        <table style="text-align: center;" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td>
                    <p>PETIKAN</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>KEPUTUSAN SEKRETARIS DAERAH DAERAH ISTIMEWA YOGYAKARTA</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>NOMOR: {{ $data->nomorsk }}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>TENTANG</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p style="margin">PENYESUAIAN GAJI POKOK</p>
                    <p>PEGAWAI NEGERI SIPIL DAN PEGAWAI PEMERINTAH DENGAN PERJANJIAN</p>
                    <p>KERJA DI LINGKUNGAN BADAN PENGELOLA KEUANGAN DAN ASET DIY</p>
                    <p>TAHUN 2024</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        SEKRETARIS DAERAH DAERAH ISTIMEWA YOGYAKARTA,
                    </p>
                </td>
            </tr>
        </table>

        {{-- Menimbang --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="width: 20%;">Menimbang</td>
                <td>dan Seterusnya</td>
            </tr>
            <tr>
                <td style="width: 20%;">Mengingat</td>
                <td>dan Seterusnya</td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;">
                    <p>MEMUTUSKAN</p>
                </td>
            </tr>
            <tr>
                <td style="width: 20%; vertical-align: top;">Menetapkan</td>
                <td style="text-align:justify; letter-spacing:0.06em;">
                    <p style="margin-top:0;">KEPUTUSAN SEKRETARIS DAERAH TENTANG PENYESUAIAN GAJI
                    POKOK PEGAWAI NEGERI SIPIL DAN PEGAWAI PEMERINTAH
                    DENGAN PERJANJIAN KERJA DI LINGKUNGAN RUMAH SAKIT JIWA GRHASIA TAHUN 2024</p> 
                </td>
            </tr>
            <tr>
                <td style="width: 20%; vertical-align: top;">
                    <p>KESATU</p>
                </td>
                <td>
                    <p>
                        Terhitung mulai tanggal 1 Januari 2024 menyesuaikan gaji pokok 
                        Calon Pegawai Negeri Sipil/Pegawai Negeri Sipil/Pegawai Pemerintah 
                        dengan Perjanjian Kerja sebagai berikut:
                    </p>
                    <div>
                        
                    </div>
                </td>
            </tr>
        </table>

        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="width: 20%; vertical-align: top;"></td>
                <td>
                    <div>
                        <table style="border: 1px solid black; border-collapse: collapse;">
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">1</td>
                                <td style="width: 25%; border: 1px solid black;">Nama</td>
                                <td style="border: 1px solid black;">{{ $data->nama }}</td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">2</td>
                                <td style="width: 25%; border: 1px solid black;">NIP</td>
                                <td style="border: 1px solid black;">{{ $data->nip }}</td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">3</td>
                                <td style="width: 25%; border: 1px solid black;">Tempat, Tanggal Lahir</td>
                                <td style="border: 1px solid black;">{{ $data->ttl }}</td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">4</td>
                                <td style="width: 25%; border: 1px solid black;">Pangkat, Golongan Ruang</td>
                                <td style="border: 1px solid black;">{{ $data->pangkatgolongan }}</td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">5</td>
                                <td style="width: 25%; border: 1px solid black;">Masa Kerja Golongan</td>
                                <td style="border: 1px solid black;">{{ $data->mkglama }}</td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">6</td>
                                <td style="width: 25%; border: 1px solid black;">Gaji Pokok Lama</td>
                                <td style="border: 1px solid black;">
                                    @if(isset($data->gapoklama))
                                        Rp. {{  number_format($data->gapoklama,2,'.',',') }}
                                    @endif    
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">7</td>
                                <td style="width: 25%; border: 1px solid black;">Gaji Pokok Baru</td>
                                <td style="border: 1px solid black;">
                                    @if(isset($data->gapokbaru))
                                        Rp. {{  number_format($data->gapokbaru,2,'.',',') }}
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">8</td>
                                <td style="width: 25%; border: 1px solid black;">Masa Kerja Golongan untuk kenaikan gaji berkala</td>
                                <td style="border: 1px solid black;">{{ $data->mkgbaru }}</td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">9</td>
                                <td style="width: 25%; border: 1px solid black;">Jabatan</td>
                                <td style="border: 1px solid black;">{{ $data->namajabatan }}</td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">10</td>
                                <td style="width: 25%; border: 1px solid black;">Unit Kerja</td>
                                <td style="border: 1px solid black;">{{ $data->unitkerja }}</td>
                            </tr>
                            <tr>
                                <td style="width: 5%; border: 1px solid black;">11</td>
                                <td style="width: 25%; border: 1px solid black;">Keterangan</td>
                                <td style="border: 1px solid black;">{{ $data->keterangan }}</td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>

            <tr>
                <td style="width: 20%; vertical-align: top;">
                    <p>KEDUA</p>
                </td>
                <td>Keputusan ini mulai berlaku pada tanggal ditetapkan.</td>
            </tr>
        </table>
        
        {{-- Penetapan --}}
        <table style="padding-right: 1cm;" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="width: 57%"></td>
                <td style="text-align: left;">Ditetapkan di Yogyakarta</td>
            </tr>
            <tr>
                <td style="width: 57%"></td>
                <td style="text-align: left;">Pada tanggal 14 Maret 2024</td>
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
                <td style="padding: 1cm;"><p>TTD</p></td>
                <td><p>TTD</p></td>
            </tr>
            <tr style="text-align: center;">
                <td>HARY SETIAWAN S.H, M.H.</td>
                <td>Drs. BENY SUHARSONO, M.Si.</td>
            </tr>
        </table>

        {{-- Footer --}}
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
    </section>
</body>
<style>
    .footer {
        position: absolute;
        bottom: 5%;
        right: 5%;
    }
</style>
</body>

</html>
