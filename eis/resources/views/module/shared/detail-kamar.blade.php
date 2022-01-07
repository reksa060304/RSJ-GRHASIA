<div class="table-responsive" style="height: 450px">
    <table class="table  table-striped table-sm table-styling" id="tbl" style="width:100%">
        <thead>
        <tr class="table-inverse">
            <th>No </th>

            <th>Tgl Registrasi </th>
            <th>No Registrasi </th>
            <th>No RM </th>
            <th>Nama Pasien </th>
            <th>Ruangan </th>
            <th>Kamar  </th>
            <th>Bed  </th>
            <th>Lama Rawat </th>
        </tr>
        </thead>
        <tbody>

        @foreach($data as $key => $d)
            @php
                $startTimeStamp = strtotime($d->tglregistrasi);
                $endTimeStamp = strtotime($d->tglpulang != null?$d->tglpulang :date('Y-m-d H:i:s'));

                $timeDiff = abs($endTimeStamp - $startTimeStamp);

                $numberDays = $timeDiff/86400;  // 86400 seconds in one day

                // and you might want to convert to integer
                $numberDays = intval($numberDays);
            @endphp
            <tr>
                <td>{{ $key + 1 }}</td>

                <td>{{ $d->tglregistrasi }}</td>
                <td>{{ $d->noregistrasi }}</td>
                <td>{{ $d->nocm }}</td>
                <td>{{ $d->namapasien }}</td>
                <td>{{ $d->namaruangan }}</td>
                <td>{{ $d->namakamar }}</td>
                <td>{{ $d->namabed }}</td>
                <td>{{ $numberDays }}</td>
            </tr>

        @endforeach
        </tbody>
    </table>
</div>
<script type="text/javascript">
    $(function(){
        $("#tbl").dataTable();
    });
</script>
