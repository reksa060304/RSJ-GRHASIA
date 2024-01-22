@extends('template.template')
@section('content-body')
<style type="text/css"></style>
<tr>
    <td bordercolor="#808080" height="13">
        <font style="font-size: 11pt" face="Arial" color="#000000">
            <span style="font-weight: 700;font-size: 12pt">
                Berita Acara Serah Terima
            </span>
        </font>
    </td>
</tr>
<tr>
    <td bordercolor="#808080" height="13"></td>
</tr>
<tr>
    <!-- Periksa apakah $data bukan null -->
    @if ($data)
    <td bordercolor="#808080" height="13">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 9pt" face="Arial"><b>Tanggal Order</b></font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401">
                        <font style="font-size: 9pt" face="Arial">{{ $data->tglorder ?? '' }} </font>
                    </td>
                    <td height="25" width="105">
                        <font style="font-size: 9pt" face="Arial"><b>Nama Ruangan</b></font>
                    </td>
                    <td>:</td>
                    <td height="25">
                        <font style="font-size: 9pt" face="Arial">{{ $data->namaruangan ?? '' }} </font>
                    </td>
                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 9pt" face="Arial"><b>Order</b></font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401">
                        <font style="font-size: 9pt" face="Arial">{{ $data->noorder ?? '' }} </font>
                    </td>
                    <td height="25" width="105">
                        <font style="font-size: 9pt" face="Arial"><b>Nama Pengorder</b></font>
                    </td>
                    <td>:</td>
                    <td height="25">
                        <font style="font-size: 9pt" face="Arial">{{ $data->namapengorder ?? '' }} </font>
                    </td>
                </tr>
                <!-- Baris 3: Checkbox -->
                <tr>
                    <td colspan="6">
                        <label>
                            <input type="checkbox" name="dekomentasiSterilisasi" value="1">
                            <font style="font-size: 9pt" face="Arial"> Dekomentasi sd Sterilisasi</font>
                        </label>
                        <label>
                            <input type="checkbox" name="pengemasanSterilisasi" value="1">
                            <font style="font-size: 9pt" face="Arial"> Pengemasan sd Sterilisasi</font>
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Tabel Baru -->
        <table cellspacing="0" cellpadding="0" border="1" width="100%" style="margin-top: 10px; margin-bottom:50px;">
            <thead>
                <tr>
                    <th>Nama Barang</th>
                    <th>Satuan</th>
                    <th>Jumlah</th>
                    <th>Verifikasi</th>
                </tr>
            </thead>
            <tbody>
                <!-- Contoh Data -->
                @foreach ($data->detailsOrder as $item)
                <tr>
                    <td>{{ $item->namaproduk }}</td>
                    <td>{{ $item->satuanstandar }}</td>
                    <td>{{ $item->qtyproduk }}</td>
                    <td>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

    </td>
    <!-- Jika data null, tampilkan pesan -->
    @else
    <td bordercolor="#808080" height="13">
        <p>Data tidak ditemukan.</p>
    </td>
    @endif

</tr>
<tr>
    <td bordercolor="#808080" height="13">
        <label>
            <font style="font-size: 9pt" face="Arial"><b>Mengetahui</b></font>
        </label>
    </td>
</tr>
@endsection