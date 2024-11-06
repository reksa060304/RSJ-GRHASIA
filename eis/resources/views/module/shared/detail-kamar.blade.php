<div class="table-responsive" style="height: 450px">
    <div style="width: 50%; margin-bottom:30px;">
        <label for="filterKelas">Filter Kelas:</label>
        <select id="filterKelas" class="form-control">
            <option value="">All</option>
            <option value="Non Kelas">Non Kelas</option>
            <option value="VVIP">VVIP</option>
            <option value="Kelas III">Kelas III</option>
            <option value="Kelas II">Kelas II</option>
            <option value="Kelas I">Kelas I</option>
            <option value="VIP">VIP</option>
            <option value="VIP A">VIP A</option>
            <option value="VIP B">VIP B</option>
        </select>
    </div>
    
    <table class="table table-striped table-sm table-styling" id="tbl" style="width:100%">
        <thead>
        <tr class="table-inverse">
            <th>No</th>
            <th>Tgl Registrasi</th>
            <th>No Registrasi</th>
            <th>No RM</th>
            <th>Nama Pasien</th>
            <th>Ruangan</th>
            <th>Kelas</th>
            <th>Kamar</th>
            <th>Bed</th>
            <th>Lama Rawat</th>
        </tr>
        </thead>
        <tbody>
        @foreach($data as $key => $d)
            @php
                $startTimeStamp = strtotime($d->tglregistrasi);
                $endTimeStamp = strtotime($d->tglpulang != null?$d->tglpulang :date('Y-m-d H:i:s'));
                $timeDiff = abs($endTimeStamp - $startTimeStamp);
                $numberDays = intval($timeDiff / 86400);  // 86400 seconds in one day
            @endphp
            <tr>
                <td>{{ $key + 1 }}</td>
                <td>{{ $d->tglregistrasi }}</td>
                <td>{{ $d->noregistrasi }}</td>
                <td>{{ $d->nocm }}</td>
                <td>{{ $d->namapasien }}</td>
                <td>{{ $d->namaruangan }}</td>
                <td>{{ $d->namakelas }}</td>
                <td>{{ $d->namakamar }}</td>
                <td>{{ $d->namabed }}</td>
                <td>{{ $numberDays }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>

<script type="text/javascript">
    $(document).ready(function() {
        // Inisialisasi DataTable
        var table = $('#tbl').DataTable();

        // Event listener untuk dropdown filter kelas
        $('#filterKelas').on('change', function() {
            var selectedKelas = $(this).val();

            // Filter tabel berdasarkan kelas yang dipilih
            if (selectedKelas) {
                table.column(6).search('^' + selectedKelas + '$', true, false).draw();
            } else {
                table.column(6).search('').draw(); // Kosongkan filter untuk menampilkan semua data
            }
        });
    });
</script>
